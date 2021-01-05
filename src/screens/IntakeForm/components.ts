import { FlatList, Text, TextInput, View } from 'react-native'
import styled from 'styled-components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics } from '../../themes'

export const NoIntakeFormInfo = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.doubleLargeMargin}px;
`

export const NoIntakeFormInfoSubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`

export const ListContainer = styled(FlatList)`
  flex: 1;
  padding-left: ${Metrics.largeMargin}px;
  padding-right: ${Metrics.largeMargin}px;
  padding-top: ${Metrics.largeMargin}px;
`

export const StyledTextInput = styled(TextInput)`
width: 90%;
  height: 100px;
  background-color: ${Colors.primaryTextLight};
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
  padding-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 300;
  elevation: 1;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
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

export const Title = styled(Text)`
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

export const Icon = styled(MaterialCommunityIcons)`
  color: ${Colors.primaryText};
`