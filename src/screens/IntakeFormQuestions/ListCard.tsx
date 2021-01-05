import React, { useContext } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { Row, Title, InfoContainer, IconContainer, Icon } from './components'
import { IntakeFormQuestions } from '../../utils/storage'
import { RealmContext } from '../../App'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

interface Props {
  guid: string
  question?: string
  changeType?: number
}

export default ({ guid, changeType, question: questionName }: Props) => {
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

  const {
    objects: { question },
    write,
  } = useRealm<{
    question: Results<IntakeFormQuestions>
  }>([
    {
      object: 'IntakeFormQuestions',
      name: 'question',
      query: `guid == "${guid}"`,
    },
  ])

  // handles the intake form card deletion
  const handleQuestionDelete = () => {
    try {
      if (question) {
        write((realmInstance: Realm) => {
          if (changeType === 1) {
            realmInstance.delete(question)
          } else {
            realmInstance.create(
              'IntakeFormQuestions',
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
        title="deleteQuestion"
        text="deleteQuestionSubTitle"
        handleConfirmAction={handleQuestionDelete}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  return (
    <TouchableWithoutFeedback onLongPress={handleModalVisibilityChange}>
      <Row>
        <InfoContainer>
          <Title>{questionName}</Title>
        </InfoContainer>
        <TouchableWithoutFeedback onPress={handleModalVisibilityChange}>
          <IconContainer>
            <Icon size={24} name="close" />
          </IconContainer>
        </TouchableWithoutFeedback>
      </Row>
    </TouchableWithoutFeedback>
  )
}
