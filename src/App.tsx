import React, { useState, useEffect, useRef } from 'react'
import { View, Keyboard, Dimensions, YellowBox } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import Realm, { Results } from 'realm'
import { storage, isIphoneX } from './utils'
import { PaperTheme } from './themes'
import { StyledSnackbar } from './shared/components'
import { UserSession } from './utils/storage'
import Navigator from './Navigator'

YellowBox.ignoreWarnings(['Warning: componentWill'])

export const RealmContext = React.createContext<Realm | undefined>(undefined)

export default () => {
  const [realm, setRealm] = useState<Realm | undefined>(undefined)
  const [message, setMessage] = useState<string | null>(null)
  const [keyboardIsOpen, changeKeyboardOpenState] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const snackbarTimeoutId = useRef<number | null>(null)

  useEffect(() => {
    let userSession: Results<UserSession>
    const getAsyncLoggedInKey = async () => {
      const isLoggedInAsyncKey = await AsyncStorage.getItem('isLoggedIn')
      setIsLoggedIn(isLoggedInAsyncKey === 'true' ? true : false)
      // setIsLoggedIn(true)
    }
    getAsyncLoggedInKey()

    const handleKeyboardOpen = () => {
      changeKeyboardOpenState(true)
    }

    const handleKeyboardClose = () => {
      changeKeyboardOpenState(false)
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardOpen
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardClose
    )
    const setUpUserSession = async () => {
      storage.performMigrations()
      const realmInstance = await Realm.open(storage.config)
      setRealm(realmInstance)
      userSession = realmInstance.objects<UserSession>('UserSession')
      if (!userSession.length) {
        realmInstance.write(() => {
          realmInstance.create(
            'UserSession',
            {
              type: 'singleInstance',
              email: null,
              fullName: null,
              message: null,
              loading: false,
              tokenCheck: false,
            },
            true
          )
        })
      }
      userSession.addListener((userSessionObject) => {
        if (userSessionObject.length) {
          setMessage(userSessionObject[0].message)
        }
      })
    }
    setUpUserSession()

    return () => {
      if (userSession) {
        userSession.removeAllListeners()
      }
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
    if (message) {
      if (snackbarTimeoutId.current) {
        clearTimeout(snackbarTimeoutId.current)
      }
      snackbarTimeoutId.current = setTimeout(handleSnackbarDismiss, 5000)
    }
  }, [message])

  const handleSnackbarDismiss = async () => {
    await storage.writeTransaction((realmInstance) => {
      realmInstance.create(
        'UserSession',
        { type: 'singleInstance', error: null },
        Realm.UpdateMode.All
      )
    }, realm)
  }

  return (
    <PaperProvider theme={PaperTheme}>
      <RealmContext.Provider value={realm}>
        <View style={{ flex: 1 }}>
          <Navigator isLoggedIn={isLoggedIn} />
          <StyledSnackbar
            visible={Boolean(message)}
            onDismiss={handleSnackbarDismiss}
            action={{
              label: 'x',
              onPress: handleSnackbarDismiss,
            }}
            duration={59999}
            style={
              keyboardIsOpen
                ? {
                    marginBottom:
                      Dimensions.get('window').height * 0.9 -
                      (isIphoneX() ? 42 : 0),
                  }
                : {}
            }>
            {message}
          </StyledSnackbar>
        </View>
      </RealmContext.Provider>
    </PaperProvider>
  )
}
