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

  const handleLeftFlingGesture = () => {
    navigation.navigate('Clients')
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
        <Text>Dashboard</Text>
      </View>
    </SignedInLayout>
  )
}
