import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { Portal, Button, Modal } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { Colors, Metrics } from '../../themes'
import { formatMessage, message, AvatarInitials } from '../../shared'
import {
  ModalCard,
  ModalText,
  ModalButtonsContainer,
} from '../../shared/components'
import {
  ContactRow,
  Name,
  ContactInfoContainer,
  Info,
  IconContainer,
  Icon,
} from './components'
import storage, { Clients, Notes } from '../../utils/storage'

interface Props {
  id?: number
  guid: string
  changeType?: number
  name: string
  lastName: string
}

export default ({ name, lastName, guid, changeType }: Props) => {
  const navigation = useNavigation()
  const [modalVisible, changeModalVisibility] = useState<boolean>(false)
  const [isDeleted, changeIsDeleted] = useState<boolean>(false)

  const {
    objects: {
      client,
      getNoteswithChangeTypeNew,
      getNoteswithoutChangeTypeNew,
    },
    write,
  } = useRealm<{
    client: Results<Clients>
    getNoteswithChangeTypeNew: Results<Notes>
    getNoteswithoutChangeTypeNew: Results<Notes>
  }>([
    { object: 'Clients', name: 'client', query: `guid == "${guid}"` },
    { object: 'Notes', name: 'notes', query: `parentGuid == "${guid}"` },
    {
      object: 'Notes',
      name: 'getNoteswithChangeTypeNew',
      query: `parentGuid == "${guid}" AND changeType == 1`,
    },
    {
      object: 'Notes',
      name: 'getNoteswithoutChangeTypeNew',
      query: `parentGuid == "${guid}" AND changeType != 1`,
    },
  ])

  // handles the contact card deletion
  const handleContactCardDelete = () => {
    try {
      if (client) {
        write((realmInstance: Realm) => {
          if (changeType === 1) {
            realmInstance.delete(client)
          } else {
            realmInstance.create(
              'Clients',
              {
                guid,
                changeType: 0,
              },
              Realm.UpdateMode.All
            )
          }
        })
        if (getNoteswithChangeTypeNew?.length) {
          write((realmInstance: Realm) => {
            realmInstance.delete(getNoteswithChangeTypeNew)
          })
        }
        if (getNoteswithoutChangeTypeNew?.length) {
          getNoteswithoutChangeTypeNew.forEach((note) => {
            write((realmInstance: Realm) => {
              realmInstance.create(
                'Notes',
                {
                  guid: note.guid,
                  changeType: 0,
                },
                Realm.UpdateMode.All
              )
            })
          })
        }
      }
      changeIsDeleted(true)
      handleModalVisibilityChange()
    } catch (error) {
      console.log(error)
    }
  }

  // handles the modal visibility
  const handleModalVisibilityChange = () => {
    changeModalVisibility((currentVisibility) => !currentVisibility)
  }

  const handleClientCardPress = () => {
    navigation.navigate('ClientDetail', {
      userGuid: guid,
    })
  }

  return !isDeleted ? (
    <>
      <TouchableWithoutFeedback
        onPress={handleClientCardPress}
        onLongPress={handleModalVisibilityChange}>
        <ContactRow>
          <AvatarInitials firstName={name} lastName={lastName} size={28} />
          <ContactInfoContainer>
            <Name>{`${name} ${lastName}`}</Name>
          </ContactInfoContainer>
          <IconContainer>
            <Icon size={24} name="chevron-right" />
          </IconContainer>
        </ContactRow>
      </TouchableWithoutFeedback>
      <Portal>
        <Modal visible={modalVisible} onDismiss={handleModalVisibilityChange}>
          <ModalCard>
            <ModalText>{formatMessage('deleteConfirmationClient')}</ModalText>
            <ModalButtonsContainer>
              <Button
                mode="contained"
                color={Colors.errorDark}
                onPress={handleContactCardDelete}
                style={{ marginRight: Metrics.baseMargin }}>
                {formatMessage('yes')}
              </Button>
              <Button mode="outlined" onPress={handleModalVisibilityChange}>
                {formatMessage('no')}
              </Button>
            </ModalButtonsContainer>
          </ModalCard>
        </Modal>
      </Portal>
    </>
  ) : null
}
