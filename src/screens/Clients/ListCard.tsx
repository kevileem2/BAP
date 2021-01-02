import React, { useContext } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { AvatarInitials } from '../../shared'
import {
  ContactRow,
  Name,
  ContactInfoContainer,
  IconContainer,
  Icon,
} from './components'
import { Clients, Notes } from '../../utils/storage'
import { RealmContext } from '../../App'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

interface Props {
  id?: number
  guid: string
  changeType?: number
  name: string
  lastName: string
}

export default ({ name, lastName, guid, changeType }: Props) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

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
    } catch (error) {
      console.log(error)
    }
    hideModal()
  }

  // handles the modal visibility
  const handleModalVisibilityChange = () => {
    showModal(
      <ModalCardRounded
        title="deleteClient"
        text="deleteConfirmationClient"
        handleConfirmAction={handleContactCardDelete}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  const handleClientCardPress = () => {
    navigation.navigate('ClientDetail', {
      userGuid: guid,
    })
  }

  return (
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
  )
}
