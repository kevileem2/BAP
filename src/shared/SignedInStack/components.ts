import styled from 'styled-components'
import { View } from 'react-native'
import { Metrics } from '../../themes'

export const IconContainer = styled(View)`
  margin: ${Metrics.halfLargeMargin}px;
  width: 25px;
  height: 25px;
`

export const ActionsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
