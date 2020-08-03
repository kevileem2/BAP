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
import image from '../../assets/images/Login-screen-decoration.png'
import { Icon, InputContainer, Button } from './components'
import { NavigationScreenProp } from 'react-navigation'
import { AuthContext } from '../../Navigator'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default ({ navigation }: Props) => {
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
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text)
  }

  const handleGoBackPress = () => {
    navigation.navigate('Login')
  }

  const handleSignUpPress = () => {}

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
              <View>
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
                  height: 24,
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
              <View>
                <Icon name="lock-open-outline" size={24} />
              </View>
              <TextInput
                placeholder={formatMessage('ConfirmPasswordHere')}
                placeholderTextColor={Colors.secondaryText}
                value={password}
                autoCapitalize="none"
                selectionColor={Colors.primary}
                onChangeText={handleConfirmPasswordChange}
                returnKeyType="go"
                textContentType="password"
                secureTextEntry={true}
                style={{
                  height: 24,
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
