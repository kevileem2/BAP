import styled from 'styled-components'
import { Text, View } from 'react-native'
import {Metrics, Colors} from '../../themes'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'


interface HeaderProps {
  isFirst?: boolean
}

export const Header = styled(View)`
margin-left: ${Metrics.largeMargin}px;
margin-right: ${Metrics.largeMargin}px;
margin-bottom: ${Metrics.smallMargin}px;
  ${({isFirst}: HeaderProps) => 
    isFirst ? 
    `margin-top: ${Metrics.largeMargin}px;` : `margin-top: ${Metrics.doubleLargeMargin}px;` 
  }}
`

export const HeaderText = styled(Text)`
  font-size: 16px;
  color: ${Colors.secondaryText};
`

interface SectionContainerProps {
  isFirst?: boolean
}

export const SectionContainer = styled(View)`
  flex-direction: row;
  align-items:center;
  margin-left: ${Metrics.largeMargin}px;
  margin-right: ${Metrics.largeMargin}px;
  padding-top: ${Metrics.largeMargin}px;
  padding-bottom: ${Metrics.largeMargin}px;
  border: 1px solid ${Colors.secondaryText};
  border-left-width: 0;
  border-right-width: 0;
  ${({isFirst}: SectionContainerProps) => !isFirst ? `border-top-width:0;`: ''}
`

export const SectionText = styled(Text)`
  font-size: 16px;
  flex:1;
`

export const IconContainer = styled(View)`
`

export const Icon = styled(MaterialIcons)`
  opacity: 1;
`