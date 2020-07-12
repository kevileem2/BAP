import { Dimensions, Platform } from 'react-native'

export default (): boolean => {
  const windowDimensions = Dimensions.get('window')
  const xsSize: boolean =
    windowDimensions.height === 812 || windowDimensions.width === 812
  const xrSize: boolean =
    windowDimensions.height === 896 || windowDimensions.width === 896

  return Platform.OS === 'ios' && (xsSize || xrSize)
}
