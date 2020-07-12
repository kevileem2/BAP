import styled from 'styled-components'
import { Snackbar } from 'react-native-paper'
import { Metrics } from '../themes'

export const StyledSnackbar = styled(Snackbar)`
  margin-bottom: ${(p: { bottomOffset?: number }) =>
    p.bottomOffset || Metrics.smallMargin}px;
`
