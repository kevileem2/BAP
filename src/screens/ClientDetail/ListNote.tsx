import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { Divider, Portal, Modal, Button } from 'react-native-paper'
import { Results } from 'realm'
import { Colors, Metrics } from '../../themes'
import { formatMessage } from '../../shared'
import {
  ModalCard,
  ModalText,
  ModalButtonsContainer,
} from '../../shared/components'
import {
  IconContainer,
  TrashIcon,
  NoteRow,
  NoteInfoContainer,
  EditIcon,
} from './components'
import useRealm from '../../utils/useRealm'
import { Notes } from '../../utils/storage'
import { format } from 'date-fns'
import { useNavigation } from '@react-navigation/native'

interface Props {
  guid: string
  message?: string | null
  index?: number
  updatedAt?: Date | null
  changeType?: number | null
  parentGuid?: string | null
}

const ListNote = ({
  index,
  message,
  updatedAt,
  changeType,
  guid,
  parentGuid,
}: Props) => {
  const navigation = useNavigation()
  const [modalDeleteVisible, changeModalDeleteVisibility] = useState<boolean>(
    false
  )
  const [isDeleted, changeIsDeleted] = useState<boolean>(false)

  const {
    objects: { notes, thisNote },
    write,
  } = useRealm<{
    notes: Results<Notes>
    thisNote: Results<Notes>
  }>([
    { object: 'Notes', name: 'notes', query: `parentGuid == "${parentGuid}"` },
    { object: 'Notes', name: 'thisNote', query: `guid == "${guid}"` },
  ])

  // handles the delete modal visibility
  const handleModalDeleteVisibilityChange = () => {
    changeModalDeleteVisibility((currentVisibility) => !currentVisibility)
  }

  // handles the relationship deletion
  const handleDeleteNotePress = () => {
    write((realmInstance: Realm) => {
      if (changeType !== 1) {
        realmInstance.create(
          'Notes',
          {
            guid,
            changeType: 0,
          },
          Realm.UpdateMode.All
        )
      } else {
        realmInstance.delete(thisNote)
      }
    })
    changeIsDeleted(true)
    handleModalDeleteVisibilityChange()
  }

  const handleEditPress = () => {
    navigation.navigate('TextInput', {
      guid,
      parentGuid,
      message,
      changeType,
    })
  }

  return !isDeleted ? (
    <>
      <NoteRow>
        <NoteInfoContainer>
          <Text style={{ color: '#000' }}>{message}</Text>
          {updatedAt && (
            <Text style={{ color: Colors.secondaryText }}>
              {`${format(updatedAt, 'dd/MM/yyyy')} - ${format(
                new Date(
                  updatedAt.getTime() + new Date().getTimezoneOffset() * 60000
                ),
                'HH:mm'
              )}`}
            </Text>
          )}
        </NoteInfoContainer>
        <View style={{ flex: 0.3, flexDirection: 'row' }}>
          <IconContainer onPress={handleEditPress}>
            <EditIcon size={22} name="pencil" />
          </IconContainer>
          <IconContainer onPress={handleModalDeleteVisibilityChange}>
            <TrashIcon size={22} name="trash-can-outline" />
          </IconContainer>
        </View>
      </NoteRow>
      {notes && index !== notes.length - 1 && (
        <Divider
          style={{
            alignSelf: 'center',
            width: '95%',
            marginBottom: Metrics.smallMargin,
            backgroundColor: Colors.primaryText,
          }}
        />
      )}
      <Portal>
        <Modal
          visible={modalDeleteVisible}
          onDismiss={handleModalDeleteVisibilityChange}>
          <ModalCard>
            <ModalText>{formatMessage('deleteConfirmationNote')}</ModalText>
            <ModalButtonsContainer>
              <Button
                mode="contained"
                color={Colors.errorDark}
                onPress={handleDeleteNotePress}
                style={{ marginRight: Metrics.baseMargin }}>
                {formatMessage('yes')}
              </Button>
              <Button
                mode="outlined"
                onPress={handleModalDeleteVisibilityChange}>
                {formatMessage('no')}
              </Button>
            </ModalButtonsContainer>
          </ModalCard>
        </Modal>
      </Portal>
    </>
  ) : null
}

export default ListNote
