import React, { useContext, useEffect, useRef, useState } from 'react'
import { TouchableWithoutFeedback, View, Text } from 'react-native'
import { Results } from 'realm'
import CheckBox from '@react-native-community/checkbox'
import {
  Title,
  TitleRow,
  TasksInfoContainer,
  ModalTitle,
  ModalDescription,
  ModalDueTime,
  ModalButtonsContainer,
  SubTitle,
  Icon,
} from './components'
import { RealmContext } from '../../../App'
import { useModal } from '../../../utils/ModalProvider'
import ModalCardRounded from '../../../shared/ModalCardRounded'
import { Tasks } from '../../../utils/storage'
import { Colors, Metrics } from '../../../themes'
import useRealm from '../../../utils/useRealm'
import { formatMessage } from '../../../shared'
import { ModalCardRounded as ModalCardRoundedStyled } from '../../../shared/components'
import { format, formatDistance } from 'date-fns'
import { Button } from 'react-native-paper'

interface Props {
  guid: string
  title: string
  description: string
  completed: boolean
  completedAt: Date
  dueTime: Date
  changeType: number
}

export default ({
  title,
  guid,
  completed,
  description,
  completedAt,
  dueTime,
  changeType,
}: Props) => {
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()
  const initialLoad = useRef(true)

  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(completed)

  const {
    objects: { task },
    write,
  } = useRealm<{
    task: Results<Tasks>
  }>([{ object: 'Tasks', name: 'task', query: `guid == "${guid}"` }])

  const getChangeType = () => {
    if (changeType === 1) {
      return 1
    }
    if (completed !== toggleCheckBox) {
      return changeType === 2 ? null : 2
    }
    return changeType
  }

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
    } else {
      const newDate = new Date()
      write((realmInstance) => {
        realmInstance.create(
          'Tasks',
          {
            guid,
            completed: toggleCheckBox,
            completedAt: newDate,
            updatedAt: newDate,
            changeType: getChangeType(),
          },
          Realm.UpdateMode.All
        )
      })
    }
  }, [toggleCheckBox])

  // handles the task card deletion
  const handleTaskDeletePress = () => {
    try {
      if (task) {
        write((realmInstance: Realm) => {
          if (changeType === 1) {
            realmInstance.delete(task)
          } else {
            realmInstance.create(
              'Tasks',
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
        title="deleteTask"
        text="deleteConfirmationTask"
        handleConfirmAction={handleTaskDeletePress}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  const handleConfirmAction = () => {
    hideModal()
  }

  const handleTaskPress = () => {
    showModal(
      <ModalCardRoundedStyled>
        <View style={{ alignItems: 'center' }}>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </View>
        <ModalDueTime>{`${formatMessage('dueDate', realm)}: ${format(
          dueTime,
          'dd/MM/yyyy'
        )}`}</ModalDueTime>
        {completedAt && (
          <ModalDueTime
            style={{ marginBottom: Metrics.baseMargin }}>{`${formatMessage(
            'completedAt',
            realm
          )}: ${format(completedAt, 'dd/MM/yyyy')}`}</ModalDueTime>
        )}
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
      </ModalCardRoundedStyled>
    )
  }

  return (
    <TitleRow>
      <TouchableWithoutFeedback
        onPress={handleTaskPress}
        onLongPress={handleModalVisibilityChange}>
        <TasksInfoContainer>
          <Title>{title}</Title>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={completed ? 'check' : 'calendar-month'} />
            <SubTitle>{`${
              completed
                ? format(completedAt, 'dd/MM/yyyy')
                : format(dueTime, 'dd/MM/yyyy')
            }`}</SubTitle>
            <SubTitle>{` - ${formatDistance(
              completed ? completedAt : dueTime,
              new Date(),
              {
                addSuffix: true,
              }
            )}`}</SubTitle>
          </View>
        </TasksInfoContainer>
      </TouchableWithoutFeedback>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Metrics.smallMargin,
        }}>
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={setToggleCheckBox}
          onCheckColor={Colors.primary}
          onTintColor={Colors.primary}
          onFillColor={Colors.primaryTextLight}
          lineWidth={1}
          tintColors={{ true: Colors.primary }}
        />
      </View>
    </TitleRow>
  )
}
