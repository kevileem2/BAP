import { DefaultTheme } from 'react-native-paper'
import Colors from './Colors'
import Metrics from './Metrics'

const theme = {
  ...DefaultTheme,
  roundness: Metrics.roundness,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    accent: Colors.accent,
    text: Colors.primaryText,
    placeholder: Colors.hintText,
    skipButton: Colors.primary,
    background: '#f2fcff',
  },
}

export default theme
