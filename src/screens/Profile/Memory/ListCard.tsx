import React, { useContext } from 'react'
import { TouchableWithoutFeedback, View, Text } from 'react-native'
import { Results } from 'realm'
import { Button } from 'react-native-paper'
import {
  Title,
  TitleRow,
  TasksInfoContainer,
  ModalTitle,
  ModalDescription,
  ModalButtonsContainer,
  IconContainer,
  Icon,
} from './components'
import { RealmContext } from '../../../App'
import { useModal } from '../../../utils/ModalProvider'
import ModalCardRounded from '../../../shared/ModalCardRounded'
import useRealm from '../../../utils/useRealm'
import { ModalCardRounded as ModalCardRoundedStyled } from '../../../shared/components'
import { Memories } from '../../../utils/storage'
import { formatMessage } from '../../../shared'
import { Colors } from '../../../themes'

interface Props {
  guid: string
  title: string
  description: string
  changeType: number
}

export default ({ title, guid, description, changeType }: Props) => {
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

  const {
    objects: { memory },
    write,
  } = useRealm<{
    memory: Results<Memories>
  }>([{ object: 'Memories', name: 'memory', query: `guid == "${guid}"` }])

  // handles the memory card deletion
  const handleMemoryDeletePress = () => {
    try {
      console.log(memory?.[0].title)
      if (memory) {
        write((realmInstance: Realm) => {
          if (changeType === 1) {
            realmInstance.delete(memory)
          } else {
            realmInstance.create(
              'Memories',
              {
                guid,
                changeType: 0,
              },
              Realm.UpdateMode.All
            )
          }
        })
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
        title="deleteMemory"
        text="deleteConfirmationMemory"
        handleConfirmAction={handleMemoryDeletePress}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  const handleConfirmAction = () => {
    hideModal()
  }

  const handleMemoryPress = () => {
    showModal(
      <ModalCardRoundedStyled>
        <View style={{ alignItems: 'center' }}>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
          <ModalButtonsContainer>
            <Button
              mode="text"
              color={Colors.accentButtonColorDark}
              onPress={handleConfirmAction}>
              <Text style={{ fontWeight: '800', fontSize: 14 }}>
                {formatMessage('ok', realm)}
              </Text>
            </Button>
          </ModalButtonsContainer>
        </View>
      </ModalCardRoundedStyled>
    )
  }

  return (
    <TitleRow>
      <TouchableWithoutFeedback
        onPress={handleMemoryPress}
        onLongPress={handleModalVisibilityChange}>
        <TasksInfoContainer>
          <Title>{`${title}`}</Title>
        </TasksInfoContainer>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handleModalVisibilityChange}>
        <IconContainer>
          <Icon size={24} name="close" />
        </IconContainer>
      </TouchableWithoutFeedback>
    </TitleRow>
  )
}
