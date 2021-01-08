import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Metrics, Colors } from '../../themes'

export const NoteRow = styled(View)`
flex-direction: column;
align-items: center;
background: ${Colors.primaryTextLight};
padding: ${Metrics.baseMargin}px;
margin-bottom: ${Metrics.baseMargin}px;
padding: ${Metrics.smallMargin}px;
border-radius: 5px;
box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
elevation: 2;
`

export const NoteInfoContainer = styled(View)`
  flex: 1;
`

export const IconContainer = styled(TouchableOpacity)`
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

export const Title = styled(Text)`
font-size: 16px;
font-weight: 300;
margin-bottom: ${Metrics.tinyMargin}px;
`

export const NoNotes = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.doubleLargeMargin}px;
`

export const NoNotesSubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`

export const Dropdown = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.baseMargin}px;
  padding: ${Metrics.smallMargin}px;
  background-color: ${Colors.primaryTextLight};
  border-radius: 5px;
  margin-bottom: ${Metrics.baseMargin}px;
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
`

export const DropdownTitle = styled(Text)`
  flex: 1;
  color: ${Colors.primaryText};
  font-weight: 500;
  align-self: center;
`
export const Icon = styled(MaterialIcons)`
  opacity: 1;
  margin-right: ${Metrics.tinyMargin}px;
`