import React, { useEffect, useState } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { Button } from 'react-native-paper'
import Realm from 'realm'
import { Guid } from 'guid-typescript'
import { StyledTextInput } from './components'
import { Colors, Metrics } from '../../themes'
import { ModalTitle } from '../../shared/components'
import { formatMessage } from '../../shared'

interface Props {
  hideModal: () => void
  write: (writeAction: (realm: Realm) => void) => void
  realm: Realm | undefined
}

export default ({ hideModal, realm, write }: Props) => {
  const [activity, setActivity] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [keyboardOpened, changeKeyboardOpenState] = useState<boolean>(false)

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
  }, [])

  const handleActivity = (value: string) => {
    if (error && value) {
      setError(false)
    }
    setActivity(value)
  }

  const handleAddActivity = () => {
    if (activity) {
      write((realmInstance: Realm) => {
        realmInstance.create(
          'Activity',
          {
            guid: String(Guid.create()).toUpperCase(),
            activity,
            changeType: 1,
          },
          Realm.UpdateMode.All
        )
      })
      hideModal()
    } else {
      setError(true)
    }
  }

  return (
    <View
      style={{
        top: keyboardOpened ? '-30%' : undefined,
        backgroundColor: Colors.primaryTextLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Metrics.largeMargin,
        marginRight: Metrics.largeMargin,
        borderRadius: 25,
      }}>
      <ModalTitle style={{ marginBottom: Metrics.baseMargin }}>
        {formatMessage('activity', realm)}
      </ModalTitle>
      <StyledTextInput
        style={{ borderWidth: error ? 1 : 0, borderColor: Colors.errorDark }}
        textAlignVertical="center"
        value={activity}
        autoCapitalize="sentences"
        selectionColor={Colors.primaryText}
        onChangeText={handleActivity}
        returnKeyType="go"
      />
      {error && (
        <Text style={{ fontWeight: '600', color: Colors.errorDark }}>
          *{formatMessage('activityMandatory', realm)}
        </Text>
      )}
      <Button
        style={{ marginBottom: Metrics.baseMargin }}
        mode="text"
        color={Colors.accentButtonColorDark}
        onPress={handleAddActivity}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 14,
          }}>
          {formatMessage('addActivity', realm)}
        </Text>
      </Button>
    </View>
  )
}
