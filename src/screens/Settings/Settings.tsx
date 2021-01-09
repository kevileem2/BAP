import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  NativeModules,
} from 'react-native'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage, Picker } from '../../shared'
import PickerItem from '../../shared/Picker/PickerItem'
import {
  Header,
  HeaderText,
  Icon,
  IconContainer,
  SectionContainer,
  SectionText,
} from './components'
import useRealm from '../../utils/useRealm'
import storage, { User, UserSession } from '../../utils/storage'
import { Metrics } from '../../themes'
import { RealmContext } from '../../App'
import {
  applyPackageToStorage,
  clearRealmStorage,
  getUpdatePackage,
} from '../../utils/dataUtils'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'
import { AuthContext } from '../../Navigator'

const offlineStateTypes = ['none', 'unknown', 'NONE', 'UNKNOWN']

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>('')

  const { showModal, hideModal } = useModal()
  const { signOut } = useContext(AuthContext)

  const languages = [
    {
      code: 'en',
      name: formatMessage('en', realm),
    },
    {
      code: 'nl',
      name: formatMessage('nl', realm),
    },
    {
      code: 'fr',
      name: formatMessage('fr', realm),
    },
  ]

  const {
    objects: { userSession },
    write,
  } = useRealm<{
    userSession: Results<UserSession>
  }>([{ object: 'UserSession', name: 'userSession' }])

  useEffect(() => {
    if (userSession?.[0].language) {
      setLanguage(userSession[0].language)
    } else {
      const locale: string | undefined =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
          : NativeModules.I18nManager.localeIdentifier

      const languageLocal = locale?.substring(0, 2).toLowerCase() || 'en'
      setLanguage(languageLocal)
    }
  }, [userSession])

  useEffect(() => {
    if (language) {
      write((realmInstance: Realm) => {
        realmInstance.create(
          'UserSession',
          {
            type: 'singleInstance',
            language,
          },
          true
        )
      })
    }
  }, [language])

  const handleRightFlingGesture = () => {
    navigation.navigate('Profile')
  }

  const handlePickerVisibilityChange = () => {
    setPickerVisible((prevState) => !prevState)
  }

  const handleClearstorage = async () => {
    if (realm) {
      await clearRealmStorage(realm)
      await handleSynchronizePress()
    }
    hideModal()
  }

  const handleValueChange = (value: string | null) => {
    if (value) {
      setLanguage(value)
    }
    handlePickerVisibilityChange()
  }

  const handleValuePress = (value: string | null) => () => {
    handleValueChange(value)
  }

  const renderPickerItem = (
    item: { code: string; name: string },
    index: number
  ) => (
    <PickerItem
      key={index}
      platform={Platform.OS}
      label={item.name}
      value={item.code}
      onPress={handleValuePress}
      index={index}
    />
  )

  const handleSynchronizePress = async () => {
    const netConnectionState = await NetInfo.fetch()
    if (offlineStateTypes.some((value) => value === netConnectionState.type)) {
      throw formatMessage('noInternet', realm)
    }
    try {
      setIsSynchronize(true)
      const accessToken = await AsyncStorage.getItem('access_token')
      const userId = await AsyncStorage.getItem('userId')
      const updatePackage = await getUpdatePackage()
      await fetch(`https://kevin.is.giestig.be/api/package/update-package`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatePackage),
      })
      realm && clearRealmStorage(realm)
      const response = await fetch(
        `https://kevin.is.giestig.be/api/package/get-package?id=${userId}`,
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
      const responseJson = await response.json()
      applyPackageToStorage(responseJson)
    } catch (e) {
      console.log(e)
    }
    setIsSynchronize(false)
  }

  const showConfirmationModal = (type: 'storage' | 'logout') => () => {
    switch (type) {
      case 'storage':
        showModal(
          <ModalCardRounded
            title="clearCache"
            text="saveConfirmation"
            handleConfirmAction={handleClearstorage}
            hideModal={hideModal}
            realm={realm}
          />
        )
        break
      case 'logout':
        showModal(
          <ModalCardRounded
            title="logout"
            text="saveConfirmation"
            handleConfirmAction={handleLogout}
            hideModal={hideModal}
            realm={realm}
          />
        )
    }
  }

  const handleLogout = async () => {
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
    hideModal()
  }

  const options = languages.map(renderPickerItem)

  return (
    <>
      <SignedInLayout
        headerTitle={formatMessage('settings', realm)}
        showSynchronizeIcon
        isSynchronizing={isSynchronizing}
        handleSynchronizePress={handleSynchronizePress}
        onRightFlingGesture={handleRightFlingGesture}
        activeTabIndex={3}>
        <View style={{ flex: 1 }}>
          <Header isFirst>
            <HeaderText>
              {formatMessage('system', realm).toUpperCase()}
            </HeaderText>
          </Header>
          <TouchableWithoutFeedback onPress={handlePickerVisibilityChange}>
            <SectionContainer isFirst>
              <IconContainer style={{ paddingRight: Metrics.halfLargeMargin }}>
                <Icon size={20} name="translate" />
              </IconContainer>
              <SectionText>{formatMessage(language, realm)}</SectionText>
              <IconContainer>
                <Icon size={24} name="chevron-right" />
              </IconContainer>
            </SectionContainer>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={showConfirmationModal('storage')}>
            <SectionContainer>
              <IconContainer style={{ paddingRight: Metrics.halfLargeMargin }}>
                <Icon size={20} name="trash-can-outline" />
              </IconContainer>
              <SectionText>{formatMessage('clearCache', realm)}</SectionText>
              <IconContainer>
                <Icon size={24} name="chevron-right" />
              </IconContainer>
            </SectionContainer>
          </TouchableWithoutFeedback>
          <Header>
            <HeaderText>
              {formatMessage('account', realm).toUpperCase()}
            </HeaderText>
          </Header>
          <TouchableWithoutFeedback onPress={showConfirmationModal('logout')}>
            <SectionContainer isFirst>
              <IconContainer style={{ paddingRight: Metrics.halfLargeMargin }}>
                <Icon size={20} name="logout" />
              </IconContainer>
              <SectionText>{formatMessage('logout', realm)}</SectionText>
              <IconContainer>
                <Icon size={24} name="chevron-right" />
              </IconContainer>
            </SectionContainer>
          </TouchableWithoutFeedback>
        </View>
      </SignedInLayout>
      <Picker
        visible={pickerVisible}
        selectedValue={language || ''}
        options={options}
        onValueChange={handleValueChange}
        onDismiss={handlePickerVisibilityChange}
      />
    </>
  )
}
