import React, { useContext } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { Row, Title, InfoContainer, IconContainer, Icon } from './components'
import { IntakeFormQuestions, IntakeForms } from '../../utils/storage'
import { RealmContext } from '../../App'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

interface Props {
  guid: string
  title?: string
  changeType?: number
}

export default ({ guid, changeType, title }: Props) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

  const {
    objects: { intakeForm, newIntakeQuestions, oldIntakeQuestions },
    write,
  } = useRealm<{
    intakeForm: Results<IntakeForms>
    newIntakeQuestions: Results<IntakeFormQuestions>
    oldIntakeQuestions: Results<IntakeFormQuestions>
  }>([
    { object: 'IntakeForms', name: 'intakeForm', query: `guid == "${guid}"` },
    {
      object: 'IntakeFormQuestions',
      name: 'newIntakeQuestions',
      query: `parentRecordGuid == "${guid}" AND changeType == 1`,
    },
    {
      object: 'IntakeFormQuestions',
      name: 'oldIntakeQuestions',
      query: `parentRecordGuid == "${guid}" AND changeType != 1`,
    },
  ])

  // handles the intake form card deletion
  const handleIntakeFormCardDelete = () => {
    try {
      write((realmInstance: Realm) => {
        if (intakeForm) {
          if (changeType === 1) {
            realmInstance.delete(intakeForm)
          } else {
            realmInstance.create(
              'IntakeForms',
              {
                guid,
                changeType: 0,
              },
              Realm.UpdateMode.All
            )
          }
        }
        if (newIntakeQuestions?.length) {
          realmInstance.delete(newIntakeQuestions)
        }
        if (oldIntakeQuestions?.length) {
          oldIntakeQuestions.forEach((question) => {
            realmInstance.create(
              'IntakeFormQuestions',
              {
                guid: question.guid,
                changeType: 0,
              },
              Realm.UpdateMode.All
            )
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
    hideModal()
  }

  // handles the modal visibility
  const handleModalVisibilityChange = () => {
    showModal(
      <ModalCardRounded
        title="deleteIntakeForm"
        text="deleteIntakeFormSubTitle"
        handleConfirmAction={handleIntakeFormCardDelete}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  const handleIntakeFormCardPress = () => {
    navigation.navigate('IntakeFormQuestions', { parentRecordGuid: guid })
  }

  return (
    <TouchableWithoutFeedback
      onPress={handleIntakeFormCardPress}
      onLongPress={handleModalVisibilityChange}>
      <Row>
        <InfoContainer>
          <Title>{title}</Title>
        </InfoContainer>
        <IconContainer>
          <Icon size={24} name="chevron-right" />
        </IconContainer>
      </Row>
    </TouchableWithoutFeedback>
  )
}
