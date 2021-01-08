import React, { useContext } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { Row, Title, InfoContainer, IconContainer, Icon } from './components'
import { Activity } from '../../utils/storage'
import { RealmContext } from '../../App'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

interface Props {
  guid: string
  activity?: string
  changeType?: number
}

export default ({ guid, changeType, activity: activityName }: Props) => {
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

  const {
    objects: { activities },
    write,
  } = useRealm<{
    activities: Results<Activity>
  }>([
    {
      object: 'Activity',
      name: 'activities',
      query: `guid == "${guid}"`,
    },
  ])

  // handles the activities card deletion
  const handleActivityDelete = () => {
    try {
      if (activities) {
        write((realmInstance: Realm) => {
          if (changeType === 1) {
            realmInstance.delete(activities)
          } else {
            realmInstance.create(
              'Activity',
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
        title="deleteActivity"
        text="deleteActivitySubTitle"
        handleConfirmAction={handleActivityDelete}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  return (
    <TouchableWithoutFeedback onLongPress={handleModalVisibilityChange}>
      <Row>
        <InfoContainer>
          <Title>{activityName}</Title>
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
