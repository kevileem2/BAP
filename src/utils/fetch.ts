import AsyncStorage from '@react-native-community/async-storage'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios'
import Config from 'react-native-config'
import { Platform } from 'react-native'
import NavigationService from './NavigationService'
import message from '../shared/message'
import { storage } from './'
import Realm from 'realm'

interface Client extends AxiosInstance {
    initialLogin: () => Promise<ResponseData>
  login: (username: string, password: string) => Promise<ResponseData>
  ssoLogin: (azureToken: string) => Promise<any>
  logout: (urlChanged?: boolean, keepPassword?: boolean) => void
  retryCount: number
}
export interface ResponseData {
  userCode: string
  loginDisplayName: string
  cultureCode: string
  domainCode: string
  logDebugInformation: boolean
  token: string
}

type LoginSuccessResponse = AxiosResponse<ResponseData>

const client: Client = axios.create({
  baseURL: "kevin.is.giestig/api"
}) as Client

client.retryCount = 0

AsyncStorage.getItem('access_token').then(token => {
  if (token) {
    tokens.access_token = token
  }
})

let tokens = {
  access_token: '',
  refresh_token: ''
}

client.interceptors.request.use((axiosConfig: AxiosRequestConfig) => {
  if (tokens.access_token) {
    return {
      ...axiosConfig,
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    }
  }
  return axiosConfig
})

client.interceptors.response.use(undefined, async error => {
  if (
    error?.response?.status === 403 &&
    error.response.data?.message === 'Invalid user or credentials'
  ) {
    await removeTokens()
    throw error.response
  } else if (error?.response?.status === 403 && client.retryCount < 5) {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      try {
        client.retryCount += 1
        await client.login()
      } catch (err) {
        await message({
          message: err,
        })
        removeTokens()
        throw err
      }
    } else {
      await message({
        message: error,
      })
      removeTokens()
      throw error
    }
  } else {
    throw error
  }
})

const setTokens = () => async (
  response: LoginSuccessResponse
) => {
  const { data } = response
  await AsyncStorage.setItem('access_token', data.token)

  tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  }

  return data
}

client.initialLogin = async (): Promise<ResponseData> => client.post(`${client.defaults.baseURL}/auth`, 
    JSON.stringify({
        username: "test",
        password: "test"
    }), {
        'x-api-key': ''
    }
)

client.login = async (): Promise<ResponseData> => {
  return client
    .post(`${client.defaults.baseURL}/auth/access`, {},{
        headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
    })
    .then(setTokens())
}

client.ssoLogin = async (azureToken: string): Promise<ResponseData> => {
  tokens.access_token = ''
  const clientName = await getDeviceName()
  const realmInstance = await Realm.open(storage.config)
  const sessionItems = realmInstance.objects<Session>('Session')[0]
  return client
    .post(
      `${client.defaults.baseURL}/auth/login/external`,
      {
        clientCode: getUniqueId(),
        clientName,
        operatingSystem: `${
          Platform.OS === 'android' ? 'Android' : 'iOS'
        } ${getSystemVersion()}`,
        loginSource: 'mobile',
        loginMethod: 'AzureAd',
        languageCode: sessionItems?.languageCode,
        systemCode: sessionItems?.systemCode,
        companyCode: sessionItems?.companyCode
      },
      {
        headers: {
          Authorization: `Bearer ${azureToken}`
        }
      }
    )
    .then(setTokens(true))
}

client.logout = async (urlChanged?: boolean, keepPassword?: boolean) => {
  const url = await AsyncStorage.getItem('apiUrl')
  if (urlChanged && url) {
    client.defaults.baseURL = url
  }
  if (!keepPassword) {
    await Keychain.resetGenericPassword()
  }
  removeTokens()
}

client.interceptors.request.use(request => {
  console.log(
    'REQUEST',
    '\n',
    'URL: ',
    request.url,
    '\n',
    'Method: ',
    request.method,
    '\n',
    'Body: ',
    request.data
  )
  return request
})

client.interceptors.response.use(response => {
  if (response) {
    console.log(
      'RESPONSE',
      '\n',
      'Status: ',
      response.status,
      '\n',
      'URL: ',
      response.config.url,
      '\n',
      'Method: ',
      response.config.method,
      '\n',
      'Status text: ',
      response.statusText,
      '\n',
      'Data: ',
      response.data
    )
  }
  return response
})

const removeTokens = async (hiddenRelogin?: boolean) => {
  try {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.setItem('ssoLogin', 'false')
    tokens = {
      access_token: ''
    }
    await CookieManager.clearAll()
    if (!hiddenRelogin) {
      NavigationService.navigate('SignedOutStack')
    }
    return true
  } catch {
    return false
  }
}

export { removeTokens, setTokens }
export default client