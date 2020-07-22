import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)

  const handleSynchronizePress = () => {
    setIsSynchronize(true)
    setTimeout(() => setIsSynchronize(false), 1000)
  }

  const handleRightFlingGesture = () => {
    navigation.navigate('Profile')
  }

  return (
    <SignedInLayout
      headerTitle="Settings"
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={3}>
      <View style={{ flex: 1 }}>
        <Text>Settings</Text>
      </View>
    </SignedInLayout>
  )
}
