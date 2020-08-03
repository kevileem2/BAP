import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../Navigator'

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)

  const { signOut } = React.useContext(AuthContext)

  const handleSynchronizePress = () => {
    setIsSynchronize(true)
    setTimeout(() => setIsSynchronize(false), 1000)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Settings')
  }

  const handleRightFlingGesture = () => {
    navigation.navigate('Clients')
  }

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem('isLoggedIn')
    signOut && signOut()
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('profile')}
      showSynchronizeIcon
      showLogout
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      handleLogoutPress={handleLogoutPress}
      onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={2}>
      <View style={{ flex: 1 }}>
        <Text>Profile</Text>
      </View>
    </SignedInLayout>
  )
}
