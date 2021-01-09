import React, { useEffect, useState } from 'react'
import { View, Text, Keyboard, Platform } from 'react-native'
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
  parentRecordGuid?: string
  index?: number
}

export default ({
  hideModal,
  realm,
  write,
  parentRecordGuid,
  index,
}: Props) => {
  const [question, setquestion] = useState<string>('')
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

  const handleQuestion = (value: string) => {
    if (error && value) {
      setError(false)
    }
    setquestion(value)
  }

  const handleAddIntakeFormPress = () => {
    if (question) {
      write((realmInstance: Realm) => {
        realmInstance.create(
          'IntakeFormQuestions',
          {
            guid: String(Guid.create()).toUpperCase(),
            question,
            parentRecordGuid,
            sort: index,
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
        top: keyboardOpened && Platform.OS === 'ios' ? '-30%' : undefined,
        backgroundColor: Colors.primaryTextLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Metrics.largeMargin,
        marginRight: Metrics.largeMargin,
        borderRadius: 25,
      }}>
      <ModalTitle style={{ marginBottom: Metrics.baseMargin }}>
        {formatMessage('question', realm)}
      </ModalTitle>
      <StyledTextInput
        style={{ borderWidth: error ? 1 : 0, borderColor: Colors.errorDark }}
        textAlignVertical="top"
        value={question}
        autoCapitalize="sentences"
        selectionColor={Colors.primaryText}
        onChangeText={handleQuestion}
        returnKeyType="go"
        multiline={true}
      />
      {error && (
        <Text style={{ fontWeight: '600', color: Colors.errorDark }}>
          *{formatMessage('questionMandatory', realm)}
        </Text>
      )}
      <Button
        style={{ marginBottom: Metrics.baseMargin }}
        mode="text"
        color={Colors.accentButtonColorDark}
        onPress={handleAddIntakeFormPress}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 14,
          }}>
          {formatMessage('addQuestion', realm)}
        </Text>
      </Button>
    </View>
  )
}
