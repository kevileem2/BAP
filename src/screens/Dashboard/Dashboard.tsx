import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { StyledButton, Title, SubTitle, Icon } from './components'
import { Colors } from '../../themes'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Results } from 'realm'
import { UserSession } from '../../utils/storage'
import useRealm from 'utils/useRealm'
import { formatMessage } from '../../shared/formatMessage'

interface Props {}

export default ({}: Props) => {
  const navigation = useNavigation()
  const {
    objects: { userSession },
  } = useRealm<{
    userSession: Results<UserSession>
  }>([{ object: 'UserSession', name: 'userSession' }])
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    if (userSession?.[0].fullName) {
      setUserName(userSession[0].fullName)
    }
  }, [userSession])

  const handleSynchronizePress = () => {
    setIsSynchronize(true)
    setTimeout(() => setIsSynchronize(false), 1000)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Clients')
  }

  const handleSpeechPress = () => {
    navigation.navigate('Speech')
  }

  const handleTextPress = () => {
    navigation.navigate('TextInput')
  }

  return (
    <SignedInLayout
      headerTitle="Dashboard"
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      onLeftFlingGesture={handleLeftFlingGesture}
      activeTabIndex={0}>
      <View style={{ flex: 1 }}>
        {userName ? (
          <Title>
            {formatMessage('Welcome')}, {userName}!
          </Title>
        ) : (
          <Title>{formatMessage('Welcome')}!</Title>
        )}
        <SubTitle>{formatMessage('QuicklyAddNote')}</SubTitle>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleSpeechPress}>
            <StyledButton
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                Colors.accentButtonColorLight,
                Colors.accentButtonColorDark,
              ]}>
              <Icon
                name="microphone"
                size={28}
                style={{
                  color: Colors.primaryTextLight,
                }}
              />
            </StyledButton>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTextPress}>
            <StyledButton
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                Colors.accentButtonColorLight,
                Colors.accentButtonColorDark,
              ]}>
              <Icon
                name="pencil"
                size={28}
                style={{
                  color: Colors.primaryTextLight,
                }}
              />
            </StyledButton>
          </TouchableOpacity>
        </View>
      </View>
    </SignedInLayout>
  )
}
