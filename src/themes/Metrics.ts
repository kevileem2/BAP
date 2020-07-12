import { Dimensions, Platform, StatusBar } from 'react-native'

const { width, height } = Dimensions.get('window')

const metrics = {
  tinyMargin: 4,
  smallMargin: 8,
  baseMargin: 16,
  halfLargeMargin: 12,
  largeMargin: 24,
  doubleLargeMargin: 48,
  roundness: 4,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  statusBarHeight: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24,
}

export default metrics
