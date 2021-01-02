import React, { useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../Navigator'
import { storage } from 'utils'
import { RealmContext } from '../../App'
import { clearRealmStorage } from '../../utils/dataUtils'
import { User } from '../../utils/storage'

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)

  const realm = useContext(RealmContext)

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
    await AsyncStorage.removeItem('refresh_token')
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('userId')
    await storage.writeTransaction((realmInstance: Realm) => {
      const user = realmInstance.objects<User>('User')
      realmInstance.delete(user)
      realmInstance.create(
        'UserSession',
        {
          type: 'singleInstance',
          email: null,
          fullName: null,
        },
        Realm.UpdateMode.All
      )
    })
    if (realm) {
      await clearRealmStorage(realm)
    }
    signOut && signOut()
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('profile', realm)}
      showSynchronizeIcon
      showLogout
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      // handleLogoutPress={handleLogoutPress}
      // onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={2}>
      <View style={{ flex: 1 }}>
        <Text>Profile</Text>
      </View>
    </SignedInLayout>
  )
}
