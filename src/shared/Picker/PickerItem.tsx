import React from 'react'
import { Picker, TouchableWithoutFeedback, View } from 'react-native'
import { Metrics } from '../../themes'
import { PickerText } from './components'

interface Props {
  platform: string
  label: string
  value: string | null
  index: number
  onPress: (value: string | null) => () => void
}

export default (props: Props) =>
  props.platform === 'ios' ? (
    <Picker.Item label={props.label} value={props.value} />
  ) : (
    <TouchableWithoutFeedback onPress={props.onPress(props.value)}>
      <View style={{ paddingTop: props.index > 0 ? Metrics.baseMargin : 0 }}>
        <PickerText>{props.label}</PickerText>
      </View>
    </TouchableWithoutFeedback>
  )
