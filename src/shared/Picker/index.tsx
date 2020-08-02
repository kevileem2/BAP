import React, { useState, useEffect } from 'react'
import { Platform, ScrollView, View, Keyboard } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { Portal, Modal, Searchbar } from 'react-native-paper'
import { Metrics } from '../../themes'
import { ModalCard } from '../components'
import { formatMessage } from '..'

interface Props {
  visible: boolean
  selectedValue: string
  options: JSX.Element[]
  showSearch?: boolean
  searchText?: string
  onSearchChange?: (text: string) => void
  onValueChange: (value: string) => void
  onDismiss: () => void
}

const getModalMaxHeight = (keyboardIsOpen: boolean) =>
  Platform.OS === 'android'
    ? { style: { maxHeight: '90%', minHeight: keyboardIsOpen ? '90%' : 0 } }
    : {}

export default (props: Props) => {
  const [keyboardIsOpen, changeKeyboardOpenState] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyboardOpen = () => {
      changeKeyboardOpenState(true)
    }

    const handleKeyboardClose = () => {
      changeKeyboardOpenState(false)
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardOpen
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardClose
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  })

  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={props.onDismiss}>
        <ModalCard {...getModalMaxHeight(keyboardIsOpen)}>
          {props.showSearch && (
            <Searchbar
              placeholder={formatMessage('search')}
              onChangeText={props.onSearchChange}
              value={props.searchText}
              style={{
                marginTop: Metrics.smallMargin,
                marginBottom:
                  Platform.OS === 'android' ? Metrics.baseMargin : 0,
              }}
            />
          )}
          {Platform.OS === 'ios' ? (
            <Picker
              selectedValue={props.selectedValue}
              onValueChange={props.onValueChange}>
              {props.options}
            </Picker>
          ) : props.options && props.options.length > 7 ? (
            <ScrollView
              style={{
                maxHeight: props.showSearch ? '85%' : '100%',
                marginBottom: Metrics.smallMargin,
              }}>
              {props.options}
            </ScrollView>
          ) : (
            <View style={{ paddingBottom: Metrics.largeMargin }}>
              {props.options}
            </View>
          )}
        </ModalCard>
      </Modal>
    </Portal>
  )
}
