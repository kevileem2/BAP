import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import { Login } from './screens/Login'
import { SignUp } from './screens/SignUp'
import { Dashboard } from './screens/Dashboard'
import { Clients } from './screens/Clients'
import { Profile } from './screens/Profile'
import { Settings } from './screens/Settings'
import { Speech } from './screens/Speech'
import { TextInput } from './screens/TextInput'
import { AddClient } from './screens/AddClient'
import { ClientDetail } from './screens/ClientDetail'

const SignedOutStack = createStackNavigator()

const SignedInStack = createStackNavigator()

const SignedOutStackNavigator = () => (
  <SignedOutStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={'Login'}>
    <SignedOutStack.Screen name="Login" component={Login} />
    <SignedOutStack.Screen name="SignUp" component={SignUp} />
  </SignedOutStack.Navigator>
)

interface SignedInStackNavigatorProps {
  handleLogin: () => void
}

const SignedInStackNavigator = () => (
  <SignedInStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={'Dashboard'}>
    <SignedInStack.Screen name="Dashboard" component={Dashboard} />
    <SignedInStack.Screen name="Clients" component={Clients} />
    <SignedInStack.Screen name="Profile" component={Profile} />
    <SignedInStack.Screen name="Settings" component={Settings} />
    <SignedInStack.Screen name="Speech" component={Speech} />
    <SignedInStack.Screen name="TextInput" component={TextInput} />
    <SignedInStack.Screen name="AddClient" component={AddClient} />
    <SignedInStack.Screen name="ClientDetail" component={ClientDetail} />
  </SignedInStack.Navigator>
)

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      const loggedInKey = await AsyncStorage.getItem('isLoggedIn')
      if (loggedInKey) {
        setIsLoggedIn(true)
      }
    }
    getTokenFromAsyncStorage()
  }, [])

  const handleLogin = () => {}

  return (
    <NavigationContainer>
      {isLoggedIn ? SignedInStackNavigator() : SignedOutStackNavigator()}
    </NavigationContainer>
  )
}
