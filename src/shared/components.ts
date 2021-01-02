import styled from 'styled-components'
import { Snackbar, Card } from 'react-native-paper'
import { Metrics } from '../themes'
import { Platform, View, Text } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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

export const ModalTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-top: ${Metrics.baseMargin}px;
  align-self: center;
  text-align: center;
`

interface ModalBackgroundEllipseProps {
  width: number
}

export const ModalBackgroundEllipse = styled(View)`
  position: absolute;
  top: -${({ width }: ModalBackgroundEllipseProps) => width * 2 - Metrics.doubleLargeMargin * 1.6}px;
  left: -${({ width }: ModalBackgroundEllipseProps) => width / 2 + Metrics.halfLargeMargin * 3}px;
  width: ${({ width }: ModalBackgroundEllipseProps) => width * 2}px;
  height: ${({ width }: ModalBackgroundEllipseProps) => width * 2}px;
  border-radius: ${({ width }: ModalBackgroundEllipseProps) => width * 2}px;
  border: 2px solid rgb(240, 240, 240);
  background-color: rgb(250, 250, 250);
`

export const ModalIcon = styled(MaterialCommunityIcons)`
  margin-top: ${Metrics.halfLargeMargin + Metrics.smallMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  align-self: center;
  text-align: center;
`

export const ModalRotatingIConContainer = styled(View)`
  margin-top: ${Metrics.halfLargeMargin + Metrics.smallMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
  align-self: center;
  text-align: center;
`

export const ModalCardRounded = styled(Card)`
  overflow: hidden;
  margin-left: ${Metrics.largeMargin}px;
  margin-right: ${Metrics.largeMargin}px;
  padding-left: ${Metrics.baseMargin}px;
  padding-right: ${Metrics.baseMargin}px;
  ${Platform.OS === 'android'
    ? `padding-top: ${Metrics.baseMargin}px;
  padding-bottom: ${Metrics.baseMargin}px;`
    : ''}
  border-radius: 25px;
`

export const AdditionalInfoContainer = styled(View)`
  margin-top: ${Metrics.baseMargin}px;
  margin-bottom: ${Metrics.baseMargin}px;
`

export const AdditionalInfo = styled(Text)`
font-size: 18px;
font-weight: 400;
`