import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import { Login } from './screens/Login'
import { SignUp } from './screens/SignUp'
import { Dashboard } from './screens/Dashboard'
import { Clients } from './screens/Clients'
import { Profile } from './screens/Profile'
import { Settings } from './screens/Settings'
import { Speech } from './screens/Speech'
import { TextInput } from './screens/TextInput'
import { AddClient } from './screens/AddClient'
import { ClientDetail } from './screens/ClientDetail'
import Loading from './screens/Loading'
import { RealmContext } from './App'

interface AuthContextInterface {
  signOut?: () => void
  signIn?: () => void
}

const Stack = createStackNavigator()

export const AuthContext = createContext<AuthContextInterface>({})

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const realm = useContext(RealmContext)

  useEffect(() => {
    const getAsyncKey = async () => {
      const isLoggedInKey = await AsyncStorage.getItem('isLoggedIn')
      isLoggedInKey ? setIsLoggedIn(true) : setIsLoggedIn(false)
    }
    getAsyncKey().then(() => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    })
  }, [])

  const authContext = useMemo(
    () => ({
      signOut: () => {
        realm?.removeAllListeners()
        setIsLoggedIn(false)
      },
      signIn: () => {
        setIsLoggedIn(true)
      },
    }),
    []
  )
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoading ? (
            <Stack.Screen name="Loading" component={Loading} />
          ) : !isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Clients" component={Clients} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="Speech" component={Speech} />
              <Stack.Screen name="TextInput" component={TextInput} />
              <Stack.Screen name="AddClient" component={AddClient} />
              <Stack.Screen name="ClientDetail" component={ClientDetail} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
