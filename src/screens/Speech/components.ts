import styled from 'styled-components'
import { View, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Metrics, Colors } from '../../themes'

export const StyledButton = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  margin-top: ${Metrics.largeMargin}px;
  margin-right: ${Metrics.smallMargin}px;
  border-radius: 50px;
`

export const Icon = styled(MaterialIcons)`
  opacity: 1;
  margin-right: ${Metrics.tinyMargin}px;
`
export const MicrophoneIcon = styled(MaterialIcons)`
  opacity: 1;
  padding: ${Metrics.smallMargin}px;
`

export const Title = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.largeMargin}px;
`
export const SubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`

export const AdditionalInfoTitle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`
export const AdditionalInfo = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  margin-left: ${Metrics.baseMargin}px;
`

export const Button = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  padding-left: ${Metrics.largeMargin}px;
  padding-right: ${Metrics.largeMargin}px;
  border-radius: 50px;
`

export const OutputContainer = styled(View)`
  height: 20%;
  margin-top: ${Metrics.baseMargin}px;
  padding: ${Metrics.smallMargin}px;
  elevation: 2;
  border-radius: 5px;
  background-color: ${Colors.primaryTextLight};
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
`

export const OutputTitle = styled(Text)`
  margin-top: ${Metrics.baseMargin}px;
  font-size: 18px;
  text-decoration: underline;
  text-decoration-color: ${Colors.buttonColorLight};
  font-weight: 500;
  text-align: center;
`

export const Dropdown = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.baseMargin}px;
  padding: ${Metrics.smallMargin}px;
  background-color: ${Colors.primaryTextLight};
  border-radius: 5px;
  margin-bottom: ${Metrics.tinyMargin}px;
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
`

export const DropdownTitle = styled(Text)`
  flex: 1;
  color: ${Colors.primaryText};
  font-weight: 500;
  align-self: center;
`

export const ErrorText = styled(Text)`
  color: ${Colors.errorDark};
  padding-left: ${Metrics.smallMargin}px;
  margin-top: ${Metrics.smallMargin}px;
`
