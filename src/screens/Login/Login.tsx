import React, { useState } from 'react'
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
import { UserSession } from 'utils/storage'
import storage from '../../utils/storage'
import { formatMessage } from '../../shared/formatMessage'
import { Metrics, Colors } from '../../themes'
import image from '../../assets/images/Login-screen-decoration.png'
import { Icon, InputContainer, Button } from './components'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../Navigator'

interface Props {
  navigation: NavigationScreenProp<any, any>
  userSession: Results<UserSession>
  realm: Realm
}

export default ({ navigation, realm }: Props) => {
  const { signIn } = React.useContext(AuthContext)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

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
    // await AsyncStorage.setItem('isLoggedIn', 'true')
    await storage.writeTransaction((realmInstance: Realm) => {
      realmInstance.create(
        'UserSession',
        { type: 'singleInstance', email, loading: false },
        Realm.UpdateMode.All
      )
    }, realm)
    signIn && signIn()
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
              <View>
                <Icon
                  style={{ color: Colors.primaryText }}
                  name="email-outline"
                  size={24}
                />
              </View>
              <TextInput
                placeholder={formatMessage('PutEmailHere')}
                placeholderTextColor={Colors.secondaryText}
                value={email}
                autoCapitalize="none"
                selectionColor={Colors.primary}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                returnKeyType="next"
                textContentType="emailAddress"
                style={{
                  height: 24,
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
              <View>
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
                  height: 24,
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
