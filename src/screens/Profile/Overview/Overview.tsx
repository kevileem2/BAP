import React, { useState, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import { RealmContext } from '../../../App'
import useRealm from '../../../utils/useRealm'
import { Memories, Tasks, UserSession } from '../../../utils/storage'
import { formatMessage } from '../../../shared'
import { NoTasksInfo, NoTasksSubTitle, Header, HeaderText } from './components'
import { default as ListCardMemory } from '../Memory/ListCard'
import { default as ListCardTask } from '../Tasks/ListCard'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [forceRefresh, setForceRefresh] = useState<boolean>(false)

  const [memories, setMemories] = useState<Results<Memories> | null>(null)
  const [tasks, setTasks] = useState<Results<Tasks> | null>(null)

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
    const realmTasks = realm
      ?.objects<Tasks>('Tasks')
      .filtered('changeType != 0 AND completed == false')
    const realmMemories = realm
      ?.objects<Memories>('Memories')
      .filtered('changeType != 0')
    if (realmTasks?.length) {
      setTasks(realmTasks)
    }
    if (realmMemories?.length) {
      setMemories(realmMemories)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmTasks = realm
        ?.objects<Tasks>('Tasks')
        .filtered('changeType != 0 AND completed == false')
      const realmMemories = realm
        ?.objects<Memories>('Memories')
        .filtered('changeType != 0')
      if (realmTasks?.length) {
        setTasks(realmTasks)
      }
      if (realmMemories?.length) {
        setMemories(realmMemories)
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
    <ListCardTask key={`contact-list-card-${item.guid}`} {...item} />
  )

  // renders each memory with props
  const renderMemory = (item) => (
    <ListCardMemory key={`contact-list-card-${item.guid}`} {...item} />
  )

  // use memo for mapping the memories
  const mapMemories = useMemo(
    () =>
      memories &&
      memories.map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        changeType: item.changeType,
      })),
    [memories]
  )

  // use memo for mapping the tasks
  const mapTasksData = useMemo(
    () =>
      tasks &&
      tasks.sorted('dueTime').map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        completed: item.completed,
        completedAt: item.completedAt,
        dueTime: item.dueTime,
        changeType: item.changeType,
      })),
    [tasks]
  )

  return loading ? null : memories?.length || tasks?.length ? (
    <View>
      <Header isFirst>
        <HeaderText>
          {formatMessage('uncompletedTasks', realm).toUpperCase()}
        </HeaderText>
      </Header>
      {mapTasksData?.map(renderTasks)}
      <Header>
        <HeaderText>
          {formatMessage('thingsToRemember', realm).toUpperCase()}
        </HeaderText>
      </Header>
      {mapMemories?.map(renderMemory)}
    </View>
  ) : (
    <>
      <NoTasksInfo>{formatMessage('noOverviewrecords', realm)}</NoTasksInfo>
      <NoTasksSubTitle>
        {formatMessage('noOverviewRecordsSubTitle', realm)}
      </NoTasksSubTitle>
    </>
  )
}
