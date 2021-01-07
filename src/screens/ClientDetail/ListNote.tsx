import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { Divider } from 'react-native-paper'
import { Results } from 'realm'
import { Colors, Metrics } from '../../themes'
import { RealmContext } from '../../App'
import {
  IconContainer,
  TrashIcon,
  NoteRow,
  NoteInfoContainer,
  EditIcon,
  Title,
} from './components'
import useRealm from '../../utils/useRealm'
import { Notes } from '../../utils/storage'
import { format } from 'date-fns'
import { useNavigation } from '@react-navigation/native'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

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
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

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
    showModal(
      <ModalCardRounded
        title="deleteNote"
        text="deleteNoteConfirmation"
        handleConfirmAction={handleDeleteNotePress}
        hideModal={hideModal}
        realm={realm}
      />
    )
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
    hideModal()
  }

  const handleEditPress = () => {
    navigation.navigate('TextInput', {
      guid,
      parentGuid,
      message,
      changeType,
    })
  }

  return (
    <NoteRow>
      <NoteInfoContainer>
        {Boolean(message?.length) && (
          <Title style={{ color: '#000' }}>{message}</Title>
        )}
        {Boolean(updatedAt) && (
          <Text style={{ color: Colors.secondaryText, fontSize: 12 }}>
            {`${format(updatedAt, 'dd/MM/yyyy')} - ${format(
              new Date(
                updatedAt.getTime() + new Date().getTimezoneOffset() * 60000
              ),
              'HH:mm'
            )}`}
          </Text>
        )}
      </NoteInfoContainer>
      <View
        style={{
          flex: 0.4,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <IconContainer onPress={handleEditPress}>
          <EditIcon size={22} name="pencil" />
        </IconContainer>
        <IconContainer onPress={handleModalDeleteVisibilityChange}>
          <TrashIcon size={22} name="trash-can-outline" />
        </IconContainer>
      </View>
    </NoteRow>
  )
}

export default ListNote
