import styled from 'styled-components'
import { View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'

export const FooterContainer = styled(View)`
  flex-direction: row;
  width: 100%;
  background-color: ${Colors.primary};
`

export const Section = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
`

export const Icon = styled(MaterialIcons)``
