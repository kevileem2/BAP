import styled from 'styled-components'
import { View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../../themes'

export const FooterContainer = styled(View)`
  flex-direction: row;
  width: 100%;
  height: 35px;
  background-color: ${Colors.primary};
`

export const Section = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const Icon = styled(MaterialIcons)``
