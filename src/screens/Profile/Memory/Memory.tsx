import React, { useState, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Results } from 'realm'
import { RealmContext } from '../../../App'
import useRealm from '../../../utils/useRealm'
import { Memories, UserSession } from '../../../utils/storage'
import { formatMessage } from '../../../shared'
import { NoTasksInfo, NoTasksSubTitle, Header, HeaderText } from './components'
import { useNavigation } from '@react-navigation/native'
import ListCard from './ListCard'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [forceRefresh, setForceRefresh] = useState<boolean>(false)

  const [memories, setMemories] = useState<Results<Memories> | null>(null)

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
    const realmMemories = realm
      ?.objects<Memories>('Memories')
      .filtered('changeType != 0')
    if (realmMemories?.length) {
      setMemories(realmMemories)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmMemories = realm
        ?.objects<Memories>('Memories')
        .filtered('changeType != 0')
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

  // renders each memory with props
  const renderMemory = (item) => (
    <ListCard key={`memory-list-card-${item.guid}`} {...item} />
  )

  // use memo for mapping the tasks
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

  return loading ? null : memories?.length ? (
    <View>
      <Header>
        <HeaderText>
          {formatMessage('thingsToRemember', realm).toUpperCase()}
        </HeaderText>
      </Header>
      {mapMemories?.map(renderMemory)}
    </View>
  ) : (
    <>
      <NoTasksInfo>{formatMessage('noMemoriesYet', realm)}</NoTasksInfo>
      <NoTasksSubTitle>
        {formatMessage('noMemoriesYetSubTitle', realm)}
      </NoTasksSubTitle>
    </>
  )
}
