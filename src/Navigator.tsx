import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Login } from './screens/Login'
import { SignUp } from './screens/SignUp'
import { Dashboard } from './screens/Dashboard'

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

const SignedInStackNavigator = () => (
  <SignedInStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={'Dashboard'}>
    <SignedInStack.Screen name="Dashboard" component={Dashboard} />
  </SignedInStack.Navigator>
)

interface NavigatorProps {
  isLoggedIn: boolean | undefined
}

export default ({ isLoggedIn }: NavigatorProps) => {
  return (
    <NavigationContainer>
      {isLoggedIn ? SignedInStackNavigator() : SignedOutStackNavigator()}
    </NavigationContainer>
  )
}
