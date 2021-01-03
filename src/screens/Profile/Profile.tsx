import React, { useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import { RealmContext } from '../../App'

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)

  const realm = useContext(RealmContext)

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

  return (
    <SignedInLayout
      headerTitle={formatMessage('profile', realm)}
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={2}>
      <View style={{ flex: 1 }}>
        <Text>Profile</Text>
      </View>
    </SignedInLayout>
  )
}
