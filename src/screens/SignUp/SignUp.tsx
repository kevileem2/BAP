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
import { formatMessage } from '../../shared/formatMessage'
import { Metrics, Colors } from '../../themes'
import {Buffer} from 'buffer'
import image from '../../assets/images/Login-screen-decoration.png'
import { Icon, InputContainer, Button } from './components'
import { NavigationScreenProp } from 'react-navigation'
import { AuthContext } from '../../Navigator'
import Axios from 'axios'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default ({ navigation }: Props) => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

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

  const handleSignUpPress = () => {
    console.log('comes in here')
    const btoa = new Buffer(`${name}:${password}`).toString("base64")
    console.log(btoa)
    // fetch('http://kevin.is.giestig/api/auth', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': "kJwL2a9tSFQiuQ8Sy75iC",
    //     'Authorization': `Basic ${btoa}`
    //   },
    // }).then((res) => {
    //   console.log(res)
    // }).catch((e) => {
    //   console.log(e)
    // })
    Axios.request({
      method: 'POST',
      url: 'auth',
      baseURL: 'http://kevin.is.giestig/api/',
      headers: {
        'Content-Type': "application/json",
        'x-api-key': "kJwL2a9tSFQiuQ8Sy75iC",
        'Authorization': `Basic ${btoa}`
      },
    }).then((res) => {
      console.log(res)
    }).catch((e) => {
      console.log(e)
    })
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
      <TouchableWithoutFeedback onPress={handleGoBackPress}>
        <View
          style={{
            position: 'absolute',
            left: Metrics.doubleLargeMargin,
            top: Metrics.doubleLargeMargin,
            zIndex: 999,
          }}>
          <Icon
            style={{ color: Colors.secondaryText }}
            name="arrow-left"
            size={32}
          />
        </View>
      </TouchableWithoutFeedback>
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
            {formatMessage('CreateAccount')}
          </Text>
          <InputContainer>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: "center"}}>
                <Icon name="account-outline" size={24} />
              </View>
              <TextInput
                placeholder={formatMessage('PutNameHere')}
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
              <View style={{justifyContent: "center"}}>
                <Icon name="email-outline" size={24} />
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
              <View style={{justifyContent: "center"}}>
                <Icon name="lock-outline" size={24} />
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
            </View>
          </InputContainer>
          <InputContainer>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: "center"}}>
                <Icon name="lock-open-outline" size={24} />
              </View>
              <TextInput
                placeholder={formatMessage('ConfirmPasswordHere')}
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
        </KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={handleSignUpPress}>
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
          <Text>{formatMessage('AlreadyHaveAnAccount')} </Text>
          <TouchableWithoutFeedback onPress={handleGoBackPress}>
            <Text style={{ color: Colors.primary }}>
              {formatMessage('SignIn')}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  )
}
