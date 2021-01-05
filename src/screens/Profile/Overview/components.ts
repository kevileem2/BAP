import styled from 'styled-components'
import { Text, View } from 'react-native'
import {Colors, Metrics} from '../../../themes'

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

interface HeaderProps {
  isFirst?: boolean
}

export const Header = styled(View)`
  padding-bottom: ${Metrics.smallMargin}px;
  margin-bottom: ${Metrics.largeMargin}px;
    ${({isFirst}: HeaderProps) => 
      isFirst ? 
      `margin-top: ${Metrics.smallMargin}px;` : `margin-top: ${Metrics.doubleLargeMargin}px;` 
    }}
  border-color: ${Colors.secondaryText};
  border-bottom-width: 1px;
`

export const HeaderText = styled(Text)`
  font-size: 16px;
  color: ${Colors.secondaryText};
`