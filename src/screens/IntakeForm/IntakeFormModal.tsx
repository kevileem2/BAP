import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import Realm from 'realm'
import { NavigationProp } from '@react-navigation/native'
import { StyledTextInput } from './components'
import { Colors, Metrics } from '../../themes'
import { ModalTitle } from '../../shared/components'
import { Guid } from 'guid-typescript'

interface Props {
  hideModal: () => void
  write: (writeAction: (realm: Realm) => void) => void
  titleCaption: string
  titleMandatoryCaption: string
  continueCaption: string
  navigation: NavigationProp<Record<string, object | undefined>>
}

export default ({
  hideModal,
  navigation,
  titleCaption,
  titleMandatoryCaption,
  continueCaption,
  write,
}: Props) => {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const handleTitle = (value: string) => {
    if (error && value) {
      setError(false)
    }
    setTitle(value)
  }

  const handleAddIntakeFormPress = () => {
    if (title) {
      const guid = String(Guid.create()).toUpperCase()
      write((realmInstance: Realm) => {
        realmInstance.create(
          'IntakeForms',
          {
            guid,
            title,
            changeType: 1,
          },
          Realm.UpdateMode.All
        )
      })
      navigation.navigate('IntakeFormQuestions', {
        guid,
      })
      hideModal()
    } else {
      setError(true)
    }
  }

  return (
    <View
      style={{
        backgroundColor: Colors.primaryTextLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Metrics.largeMargin,
        marginRight: Metrics.largeMargin,
        borderRadius: 25,
      }}>
      <ModalTitle style={{ marginBottom: Metrics.baseMargin }}>
        {titleCaption}
      </ModalTitle>
      <StyledTextInput
        style={{ borderWidth: error ? 1 : 0, borderColor: Colors.errorDark }}
        textAlignVertical="center"
        value={title}
        autoCapitalize="sentences"
        selectionColor={Colors.primaryText}
        onChangeText={handleTitle}
        returnKeyType="go"
        multiline={true}
      />
      {error && (
        <Text style={{ fontWeight: '600', color: Colors.errorDark }}>
          *{titleMandatoryCaption}
        </Text>
      )}
      <Button
        style={{ marginBottom: Metrics.baseMargin }}
        mode="text"
        color={Colors.accentButtonColorDark}
        onPress={handleAddIntakeFormPress}>
        <Text style={{ fontWeight: '800', fontSize: 14 }}>
          {continueCaption}
        </Text>
      </Button>
    </View>
  )
}
