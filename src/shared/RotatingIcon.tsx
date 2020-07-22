import React, { useEffect, useState } from 'react'
import { Animated, Easing } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  name: string
  size: number
  color: string
}

export default ({ name, size, color }: Props) => {
  const [rotation] = useState<Animated.Value>(new Animated.Value(0))

  useEffect(() => {
    spin()
  }, [])

  function spin() {
    rotation.setValue(0)
    Animated.timing(rotation, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin())
  }

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: [`360deg`, '0deg'],
  })

  return (
    <Animated.View
      style={{
        transform: [{ rotate }],
        justifyContent: 'center',
        alignItems: 'center',
        width: size,
        heigth: size,
      }}>
      <Icon name={name} size={size} color={color} />
    </Animated.View>
  )
}
