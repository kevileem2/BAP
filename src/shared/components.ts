import styled from 'styled-components'
import { Snackbar, Card } from 'react-native-paper'
import { Metrics } from '../themes'
import { Platform, View, Text } from 'react-native'

export const StyledSnackbar = styled(Snackbar)`
  margin-bottom: ${(p: { bottomOffset?: number }) =>
    p.bottomOffset || Metrics.smallMargin}px;
`

export const ModalCard = styled(Card)`
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
  margin-left: ${Metrics.largeMargin}px;
  margin-right: ${Metrics.largeMargin}px;
  ${Platform.OS === 'android'
    ? `padding-top: ${Metrics.baseMargin}px;
  padding-bottom: ${Metrics.baseMargin}px;`
    : ''}
`

export const ModalText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  align-self: center;
  text-align: center;
`

export const ModalButtonsContainer = styled(View)`
  flex-direction: row;
  align-self: center;
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
`
