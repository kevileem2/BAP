import styled from 'styled-components'
import { Text, View } from 'react-native'
import {Metrics, Colors} from '../../themes'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const Header = styled(View)`
  flex-direction: row;
  border-color: ${Colors.primaryTextLight};
  border-top-width: 1px;
  background-color: ${Colors.buttonColorDark};
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  `
  
  interface SectionProps {
    isFirst?: boolean
    isLast?: boolean
    isActive?: boolean
  }
  
  export const Section = styled(View)`
  flex:1;
  justify-content: center;
  align-items: center;
  padding: ${Metrics.smallMargin}px;
  background-color: ${({isActive}: SectionProps) => isActive ? Colors.buttonColorDark :Colors.buttonColorLight};
  border-color: ${Colors.primaryTextLight};
  ${({isLast}: SectionProps) => !isLast ? `
    border-right-width: 1px;
    `: `
    border-bottom-right-radius: 25px;
  `}
  ${({isFirst}: SectionProps) => isFirst && `
    border-bottom-left-radius: 25px;
  `}
`

export const Icon = styled(MaterialIcons)`
  color: ${Colors.primaryTextLight}
`