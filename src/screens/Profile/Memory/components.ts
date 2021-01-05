import styled from 'styled-components'
import { Text, View } from 'react-native'
import {Colors, Metrics} from '../../../themes'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const NoTasksInfo = styled(Text)`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin-top: ${Metrics.doubleLargeMargin}px;
`

export const NoTasksSubTitle = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.tinyMargin}px;
`

export const Header = styled(View)`
  padding-bottom: ${Metrics.smallMargin}px;
  margin-bottom: ${Metrics.largeMargin}px;
  margin-top: ${Metrics.smallMargin}px;
  border-color: ${Colors.secondaryText};
  border-bottom-width: 1px;
`

export const HeaderText = styled(Text)`
  font-size: 16px;
  color: ${Colors.secondaryText};
`

export const Title = styled(Text)`
  font-size: 16px;
  font-weight: 300;
`
export const Info = styled(Text)`
  font-size: 12px;
  font-weight: 300;
`

export const TitleRow = styled(View)`
  flex-direction: row;
  align-items: center;
  background: ${Colors.primaryTextLight};
  margin-bottom: ${Metrics.baseMargin}px;
  padding: ${Metrics.smallMargin}px;
  border-radius: 5px;
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.14);
  elevation: 2;
`

export const TasksInfoContainer = styled(View)`
  flex: 6;
  margin-left: ${Metrics.baseMargin}px;
  margin-right: ${Metrics.baseMargin}px;
`

export const ModalTitle = styled(Text)`
  font-size: 18px;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  `
  
export const ModalDescription = styled(Text)`
  text-align: center;
  color: ${Colors.secondaryText};
  margin-bottom: ${Metrics.baseMargin}px;
`

export const ModalButtonsContainer = styled(View)`
  flex-direction: row;
  align-self: center;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
`

export const IconContainer = styled(View)`
  flex: 1;
  align-items: flex-end;
`

export const Icon = styled(MaterialCommunityIcons)`
  color: ${Colors.errorDark};
`