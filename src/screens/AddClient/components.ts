import styled from 'styled-components'
import { Card } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'
import { Dimensions, View } from 'react-native'

export const Container = styled(Card)`
  position: relative;
  justify-content: center;
  width: 100%;
  margin-top: ${Metrics.largeMargin}px;
  margin-bottom: ${Metrics.doubleLargeMargin}px;
  padding: ${Metrics.baseMargin}px;
  padding-bottom: ${Metrics.largeMargin}px;
  min-height: 100px;
  background: ${Colors.primaryTextLight};
  border-radius: 7px;
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
`

interface IconProps {
  hide?: boolean
}

export const Icon = styled(MaterialIcons)`
  opacity: ${({ hide }: IconProps) => (hide ? 0 : 1)}
  color: ${Colors.primaryTextLight};
`

export const InputContainer = styled(View)`
  flex-direction: column;
  border-bottom-width: 2px;
  border-bottom-color: ${Colors.primary};
  elevation: 0;
`
export const Button = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.smallMargin}px;
  border-radius: 50px;
`

export const IconHeaderContainer = styled(LinearGradient)`
  position: absolute;
  margin: auto;
  justify-content: center;
  align-items: center;
  left: ${Dimensions.get('window').width / 2 -
  Metrics.doubleLargeMargin -
  Metrics.baseMargin}px;
  height: ${Metrics.doubleLargeMargin}px;
  width: ${Metrics.doubleLargeMargin}px;
  top: -${Metrics.largeMargin + Metrics.baseMargin}px;
  border-radius: 50px;
  box-shadow: 0px 7px 6px rgba(0, 0, 0, 0.2);
`

export const IconHeaderContainerWrapper = styled(View)`
  box-shadow: 0px 7px 6px rgba(0, 0, 0, 0.2);
`

export const IconHeader = styled(MaterialIcons)`
  color: ${Colors.primaryTextLight};
`
