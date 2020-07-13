import styled from 'styled-components'
import { View } from 'react-native'
import { Card } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'

interface IconProps {
  hide?: boolean
}

export const Icon = styled(MaterialIcons)`
  opacity: ${({ hide }: IconProps) => (hide ? 0 : 1)}
  color: ${Colors.primaryText};
`

interface InputContainerProps {
  isFirst?: boolean
}

export const InputContainer = styled(Card)`
  flex-direction: column;
  margin-top: ${({ isFirst }: InputContainerProps) =>
    isFirst ? Metrics.doubleLargeMargin : Metrics.largeMargin}px;
  padding: ${Metrics.tinyMargin}px;
  padding-bottom: ${Metrics.smallMargin}px;
  border-bottom-width: ${({ isFirst }: InputContainerProps) =>
    isFirst ? 0 : 2}px;
  border-bottom-color: ${Colors.primary};
  elevation: ${({ isFirst }: InputContainerProps) => (isFirst ? 2 : 0)};
  box-shadow: ${({ isFirst }: InputContainerProps) =>
    isFirst ? '0px 4px 10px rgba(0, 0, 0, 0.15)' : '0px 0px 0px'};
`
export const Button = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.smallMargin}px;
  border-radius: 50px;
`
