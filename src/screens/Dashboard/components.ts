import styled from 'styled-components'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Metrics, Colors } from '../../themes'

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
  margin-top: ${Metrics.largeMargin}px;
`
export const SubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`

export const ContactRow = styled(View)`
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
export const Info = styled(Text)`
  font-size: 12px;
  font-weight: 300;
`

export const ContactInfoContainer = styled(View)`
  flex: 6;
  margin-left: ${Metrics.baseMargin}px;
`

export const IconContainer = styled(View)`
  flex: 1;
  align-items: flex-end;
`
