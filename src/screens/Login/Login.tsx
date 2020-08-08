import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import Realm, { Results } from 'realm'
import { Guid } from 'guid-typescript'
import { Buffer } from 'buffer'
import storage, { UserSession } from '../../utils/storage'
import { formatMessage } from '../../shared/formatMessage'
import { Metrics, Colors } from '../../themes'
import image from '../../assets/images/Login-screen-decoration.png'
import { Icon, InputContainer, Button } from './components'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../Navigator'
import { RealmContext } from '../../App'

interface Props {
  navigation: NavigationScreenProp<any, any>
  userSession: Results<UserSession>
}

export default ({ navigation }: Props) => {
  const { signIn } = React.useContext(AuthContext)

  const realm = useContext(RealmContext)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const { width } = Dimensions.get('window')

  const ratio = (width * 0.8) / 936

  const handleEmailChange = (text: string) => {
    setEmail(text)
  }
  const handlePasswordChange = (text: string) => {
    setPassword(text)
  }

  const handleSignUpPress = () => {
    navigation.navigate('SignUp')
  }

  const handleLoginPress = async () => {
    const btoa = new Buffer(`${email}:${password}`).toString('base64')
    try {
      if (email && password) {
        setError(null)
        let firstRefreshToken = ''
        let refreshToken = ''
        let accessToken = ''
        let userId = ''
        const firstResponse = await fetch(
          'https://kevin.is.giestig.be/api/auth',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
              Authorization: `Basic ${btoa}`,
            },
          }
        )
        const apifirstRefreshjson = await firstResponse.json()
        firstRefreshToken = apifirstRefreshjson.refresh_token
        const accessResponse = await fetch(
          'https://kevin.is.giestig.be/api/auth/access',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
              Authorization: `Bearer ${firstRefreshToken}`,
            },
          }
        )
        const accessResponseJson = await accessResponse.json()
        refreshToken = accessResponseJson.refresh_token
        accessToken = accessResponseJson.access_token
        const authenticationResponse = await fetch(
          'https://kevin.is.giestig.be/api/auth',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const authenticationResponseJson = await authenticationResponse.json()
        if (authenticationResponseJson.loggedIn) {
          userId = authenticationResponseJson.id
          await storage.writeTransaction((realmInstance: Realm) => {
            realmInstance.create(
              'UserSession',
              {
                type: 'singleInstance',
                email,
                loading: false,
                fullName: authenticationResponseJson.name,
              },
              Realm.UpdateMode.All
            )
            realmInstance.create(
              'User',
              { guid: String(Guid.create()).toUpperCase(), email },
              Realm.UpdateMode.All
            )
          }, realm)
          signIn && signIn()
        }
        await AsyncStorage.setItem('refresh_token', refreshToken)
        await AsyncStorage.setItem('access_token', accessToken)
        await AsyncStorage.setItem('userId', userId.toString())
        await AsyncStorage.setItem('isLoggedIn', 'true')
      } else {
        setError(formatMessage('checkEverythingFilledIn'))
      }
    } catch (e) {
      setError(formatMessage('LogginFailed'))
      console.log(e)
    }
  }

  return (
    <>
      <StatusBar />
      <Image
        source={image}
        style={{
          position: 'absolute',
          right: 0,
          width: width * 0.8,
          height: ratio * 318,
          zIndex: 1,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingLeft: Metrics.doubleLargeMargin,
          paddingRight: Metrics.doubleLargeMargin,
          paddingBottom: Metrics.smallMargin,
          backgroundColor: '#FFF',
        }}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={{ paddingBottom: Metrics.tinyMargin }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '700',
              marginBottom: Metrics.smallMargin,
            }}>
            {formatMessage('Login')}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: Colors.secondaryText,
            }}>
            {formatMessage('PleaseSignIn')}
          </Text>
          <InputContainer>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{ justifyContent: 'center' }}>
                <Icon
                  style={{ color: Colors.primaryText }}
                  name="account-outline"
                  size={24}
                />
              </View>
              <TextInput
                placeholder={formatMessage('PutUserNameHere')}
                placeholderTextColor={Colors.secondaryText}
                value={email}
                autoCapitalize="none"
                selectionColor={Colors.primary}
                onChangeText={handleEmailChange}
                returnKeyType="next"
                style={{
                  width: '85%',
                  marginLeft: Metrics.smallMargin,
                  fontSize: email ? 18 : 14,
                  fontWeight: email ? '500' : '300',
                }}
              />
            </View>
          </InputContainer>
          <InputContainer>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{ justifyContent: 'center' }}>
                <Icon
                  style={{ color: Colors.primaryText }}
                  name="lock-outline"
                  size={24}
                />
              </View>
              <TextInput
                placeholder={formatMessage('PutPasswordHere')}
                placeholderTextColor={Colors.secondaryText}
                value={password}
                autoCapitalize="none"
                selectionColor={Colors.primary}
                onChangeText={handlePasswordChange}
                returnKeyType="go"
                textContentType="password"
                secureTextEntry={true}
                style={{
                  width: '85%',
                  marginLeft: Metrics.smallMargin,
                }}
              />
              {/* <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: Colors.primary,
                    alignSelf: 'flex-end',
                  }}>
                  {formatMessage('Forgot').toUpperCase()}
                </Text>
              </View> */}
            </View>
          </InputContainer>
          {Boolean(error?.length) && (
            <Text
              style={{
                color: Colors.errorDark,
                marginTop: Metrics.baseMargin,
              }}>
              * {error}
            </Text>
          )}
        </KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={handleLoginPress}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: Metrics.largeMargin,
            }}>
            <Button
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
              <Text
                style={{
                  color: Colors.primaryTextLight,
                  fontWeight: '500',
                }}>
                LOGIN
              </Text>
              <Icon
                name="chevron-right"
                size={28}
                style={{
                  marginLeft: Metrics.baseMargin,
                  color: Colors.primaryTextLight,
                }}
              />
            </Button>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            position: 'absolute',
            bottom: Metrics.baseMargin,
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'flex-end',
          }}>
          <Text>{formatMessage('DontHaveAnAccount')} </Text>
          <TouchableWithoutFeedback onPress={handleSignUpPress}>
            <Text style={{ color: Colors.primary }}>
              {formatMessage('SignUp')}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  )
}
