import styled from 'styled-components'
import { View, FlatList, Text } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { Metrics, Colors } from '../../themes'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const ListContainer = styled(FlatList)`
  flex: 1;
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
  margin-top: ${Metrics.baseMargin}px;
`

export const SearchBarStyled = styled(Searchbar)`
  margin-top: ${Metrics.largeMargin}px;
  margin-left: ${Metrics.baseMargin}px;
  margin-right: ${Metrics.baseMargin}px;
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

export const Icon = styled(MaterialCommunityIcons)`
  color: ${Colors.primaryText};
`

export const NoClientsInfo = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.doubleLargeMargin}px;
`

export const NoClientsInfoSubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`
