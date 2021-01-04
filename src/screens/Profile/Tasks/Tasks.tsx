import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Results } from 'realm'
import { RealmContext } from '../../../App'
import useRealm from '../../../utils/useRealm'
import { Tasks, UserSession } from '../../../utils/storage'
import { formatMessage } from '../../../shared'
import { NoTasksInfo, NoTasksSubTitle, Header, HeaderText } from './components'
import ListCard from './ListCard'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface Props {}

export default ({}: Props) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [forceRefresh, setForceRefresh] = useState<boolean>(false)

  const [completedTasks, setCompletedTasks] = useState<Results<Tasks> | null>(
    null
  )
  const [uncompletedTasks, setUncompletedTasks] = useState<Results<
    Tasks
  > | null>(null)

  const {
    objects: { userSession },
  } = useRealm<{
    userSession: Results<UserSession>
  }>([{ object: 'UserSession', name: 'userSession' }])

  useEffect(() => {
    if (realm) {
      try {
        realm.addListener('change', realmListener)
      } catch (e) {
        console.log(e)
      }
    }
    return () => {
      realm?.removeListener('change', realmListener)
    }
  }, [])

  const realmListener = () => {
    const realmCompletedTasks = realm
      ?.objects<Tasks>('Tasks')
      .filtered('changeType != 0 AND completed == true')
    const realmUncompletedTasks = realm
      ?.objects<Tasks>('Tasks')
      .filtered('changeType != 0 AND completed == false')
    if (realmCompletedTasks?.length) {
      setCompletedTasks(realmCompletedTasks)
    }
    if (realmUncompletedTasks?.length) {
      setUncompletedTasks(realmUncompletedTasks)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmCompletedTasks = realm
        ?.objects<Tasks>('Tasks')
        .filtered('changeType != 0 AND completed == true')
      const realmUncompletedTasks = realm
        ?.objects<Tasks>('Tasks')
        .filtered('changeType != 0 AND completed == false')
      if (realmCompletedTasks?.length) {
        setCompletedTasks(realmCompletedTasks)
      }
      if (realmUncompletedTasks?.length) {
        setUncompletedTasks(realmUncompletedTasks)
      }
    }
  }, [realm, navigation])

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    setForceRefresh((prevState) => !prevState)
  }, [userSession])

  // renders each task with props
  const renderTasks = (item) => (
    <ListCard key={`task-list-card-${item.guid}`} {...item} />
  )

  // use memo for mapping the tasks
  const mapCompletedTasksData = useMemo(
    () =>
      completedTasks &&
      completedTasks.sorted('dueTime').map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        completed: item.completed,
        completedAt: item.completedAt,
        dueTime: item.dueTime,
        changeType: item.changeType,
      })),
    [completedTasks]
  )
  // use memo for mapping the tasks
  const mapUncompletedTasksData = useMemo(
    () =>
      uncompletedTasks &&
      uncompletedTasks.sorted('dueTime').map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        completed: item.completed,
        completedAt: item.completedAt,
        dueTime: item.dueTime,
        changeType: item.changeType,
      })),
    [uncompletedTasks]
  )

  return loading ? null : completedTasks?.length || uncompletedTasks?.length ? (
    <View>
      <Header isFirst>
        <HeaderText>
          {formatMessage('uncompletedTasks', realm).toUpperCase()}
        </HeaderText>
      </Header>
      {mapUncompletedTasksData?.map(renderTasks)}
      <Header>
        <HeaderText>
          {formatMessage('completedTasks', realm).toUpperCase()}
        </HeaderText>
      </Header>
      {mapCompletedTasksData?.map(renderTasks)}
    </View>
  ) : (
    <>
      <NoTasksInfo>{formatMessage('noTasksYet', realm)}</NoTasksInfo>
      <NoTasksSubTitle>
        {formatMessage('noTasksYetSubTitle', realm)}
      </NoTasksSubTitle>
    </>
  )
}
