import styled from 'styled-components'
import { Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Metrics } from '../../themes'

export const StyledButton = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  margin: ${Metrics.largeMargin}px;
  border-radius: 50px;
`

export const Icon = styled(MaterialIcons)`
  opacity: 1;
  padding: ${Metrics.smallMargin}px;
`

export const Title = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.doubleLargeMargin}px;
`
export const SubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`
