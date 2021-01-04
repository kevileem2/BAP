import styled from 'styled-components'
import { View, TextInput, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'


export const Header = styled(View)`
margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
  margin-left: ${Metrics.smallMargin}px;
  margin-right: ${Metrics.smallMargin}px;
`

export const HeaderText = styled(Text)`
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

export const Button = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.smallMargin}px;
  border-radius: 50px;
`

export const Icon = styled(MaterialIcons)`
  opacity: 1;
  color: ${Colors.primaryTextLight};
`