import styled from 'styled-components'
import { Card } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'
import { Dimensions, View, Text, TextInput } from 'react-native'

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

export const InputHeaderContainer = styled(View)`
margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.smallMargin}px;
  margin-left: ${Metrics.smallMargin}px;
  margin-right: ${Metrics.smallMargin}px;
`

export const InputHeaderText = styled(Text)`
  font-size: 18px;
  color: ${Colors.primaryText};
`

export const StyledTextInput = styled(TextInput)`
  height: 40px;
  background-color: ${Colors.primaryTextLight};
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 300;
  elevation: 1;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
`

export const Header = styled(View)`
  padding-bottom: ${Metrics.smallMargin}px;
  margin-bottom: ${Metrics.largeMargin}px;
  margin-top: ${Metrics.doubleLargeMargin}px;
  border-color: ${Colors.secondaryText};
  border-bottom-width: 1px;
`

export const HeaderText = styled(Text)`
  font-size: 16px;
  color: ${Colors.secondaryText};
`

export const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  background: ${Colors.primaryTextLight};
  margin-bottom: ${Metrics.baseMargin}px;
  padding: ${Metrics.smallMargin}px;
  border-radius: 5px;
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
  elevation: 2;
`

export const Name = styled(Text)`
  font-size: 16px;
  font-weight: 300;
`

export const InfoContainer = styled(View)`
  flex: 6;
  margin-left: ${Metrics.baseMargin}px;
`

export const IconContainer = styled(View)`
  flex: 1;
  align-items: flex-end;
`