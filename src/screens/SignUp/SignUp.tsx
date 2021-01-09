import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { formatMessage } from '../../shared/formatMessage'
import { Metrics, Colors } from '../../themes'
import { Buffer } from 'buffer'
import image from '../../assets/images/Login-screen-decoration.png'
import { Icon, InputContainer, Button } from './components'
import { NavigationScreenProp } from 'react-navigation'
import { AuthContext } from '../../Navigator'
import storage from '../../utils/storage'
import { Guid } from 'guid-typescript'
import { RealmContext } from '../../App'

const offlineStateTypes = ['none', 'unknown', 'NONE', 'UNKNOWN']

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default ({ navigation }: Props) => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const realm = useContext(RealmContext)

  const { signIn } = React.useContext(AuthContext)

  const { width } = Dimensions.get('window')

  const ratio = (width * 0.8) / 936

  const handleEmailChange = (text: string) => {
    setEmail(text)
  }
  const handlePasswordChange = (text: string) => {
    setPassword(text)
  }
  const handleNameChange = (text: string) => {
    setName(text)
  }

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text)
  }

  const handleGoBackPress = () => {
    navigation.navigate('Login')
  }

  const handleSignUpPress = async () => {
    const netConnectionState = await NetInfo.fetch()
    if (email && name && password) {
      if (password === confirmPassword) {
        setError(null)
        const btoa = new Buffer(`${name}:${password}`).toString('base64')
        try {
          if (
            offlineStateTypes.some((value) => value === netConnectionState.type)
          ) {
            throw formatMessage('noInternet', realm)
          }
          await fetch('https://kevin.is.giestig.be/api/add-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'Cvqsam8axl8LTqzr0aT3L',
            },
            body: JSON.stringify({
              username: name,
              email,
              password,
            }),
          })
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
        } catch (e) {
          console.log(e)
          if (typeof e === typeof '') {
            setError(formatMessage('noInternet', realm))
          } else {
            setError(formatMessage('LogginFailed', realm))
          }
        }
      } else {
        setError(formatMessage('passwordsDontMatch', realm))
      }
    } else {
      setError(formatMessage('checkEverythingFilledIn', realm))
    }
  }

  return (
    <>
      <StatusBar hidden={true} />
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
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#FFF' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{
          justifyContent: 'center',
          paddingLeft: Metrics.doubleLargeMargin,
          paddingRight: Metrics.doubleLargeMargin,
          paddingBottom: Metrics.smallMargin,
        }}
        scrollEnabled={true}>
        <TouchableWithoutFeedback onPress={handleGoBackPress}>
          <View
            style={{
              marginTop: Metrics.doubleLargeMargin,
              marginBottom: Metrics.doubleLargeMargin,
              zIndex: 999,
            }}>
            <Icon
              style={{ color: Colors.secondaryText }}
              name="arrow-left"
              size={32}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            marginBottom: Metrics.smallMargin,
          }}>
          {formatMessage('CreateAccount', realm)}
        </Text>
        <InputContainer>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Icon name="account-outline" size={24} />
            </View>
            <TextInput
              placeholder={formatMessage('PutUserNameHere', realm)}
              placeholderTextColor={Colors.secondaryText}
              value={name}
              autoCapitalize="words"
              selectionColor={Colors.primary}
              onChangeText={handleNameChange}
              returnKeyType="next"
              textContentType="name"
              style={{
                width: '85%',
                marginLeft: Metrics.smallMargin,
                fontSize: name ? 18 : 14,
                fontWeight: name ? '500' : '300',
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
              <Icon name="email-outline" size={24} />
            </View>
            <TextInput
              placeholder={formatMessage('PutEmailHere', realm)}
              placeholderTextColor={Colors.secondaryText}
              value={email}
              autoCapitalize="none"
              selectionColor={Colors.primary}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              returnKeyType="next"
              textContentType="emailAddress"
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
              <Icon name="lock-outline" size={24} />
            </View>
            <TextInput
              placeholder={formatMessage('PutPasswordHere', realm)}
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
          </View>
        </InputContainer>
        <InputContainer>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Icon name="lock-open-outline" size={24} />
            </View>
            <TextInput
              placeholder={formatMessage('ConfirmPasswordHere', realm)}
              placeholderTextColor={Colors.secondaryText}
              value={confirmPassword}
              autoCapitalize="none"
              selectionColor={Colors.primary}
              onChangeText={handleConfirmPasswordChange}
              returnKeyType="go"
              textContentType="password"
              secureTextEntry={true}
              style={{
                width: '85%',
                marginLeft: Metrics.smallMargin,
              }}
            />
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: Metrics.largeMargin,
          }}>
          <TouchableWithoutFeedback onPress={handleSignUpPress}>
            <Button
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
              <Text
                style={{
                  color: Colors.primaryTextLight,
                  fontWeight: '500',
                }}>
                SIGN UP
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
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: Metrics.baseMargin,
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        <Text>{formatMessage('AlreadyHaveAnAccount', realm)} </Text>
        <TouchableWithoutFeedback onPress={handleGoBackPress}>
          <Text style={{ color: Colors.primary }}>
            {formatMessage('SignIn', realm)}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </>
  )
}
