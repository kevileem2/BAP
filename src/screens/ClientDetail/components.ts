import styled from 'styled-components'
import { Dimensions, View, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Metrics, Colors } from '../../themes'

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

export const ContainerBody = styled(View)`
  position: relative;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin-top: ${Metrics.largeMargin}px;
  margin-left: ${Metrics.baseMargin}px;
  margin-right: ${Metrics.baseMargin}px;
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
`

export const IconHeaderContainerWrapper = styled(View)`
  box-shadow: 0px 7px 6px rgba(0, 0, 0, 0.2);
`

export const IconHeader = styled(MaterialIcons)`
  color: ${Colors.primaryTextLight};
`

export const NoteRow = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
`

export const NoteInfoContainer = styled(View)`
  flex: 1;
`

export const IconContainer = styled(TouchableOpacity)`
  flex: 1;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  height: 30px;
  width: 30px;
`

export const TrashIcon = styled(MaterialIcons)`
  color: ${Colors.errorLight};
`
export const EditIcon = styled(MaterialIcons)`
  color: ${Colors.succesDark};
`
