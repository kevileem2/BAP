import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Results } from 'realm'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { StyledButton, Icon, Header, HeaderText } from './components'
import { Colors, Metrics } from '../../themes'
import NetInfo from '@react-native-community/netinfo'
import { Memories, Notes, Tasks, UserSession } from '../../utils/storage'
import { formatMessage } from '../../shared/formatMessage'
import ListCard from './ListCard'
import { default as ListCardTask } from '../Profile/Tasks/ListCard'
import { default as ListCardMemory } from '../Profile/Memory/ListCard'
import { RealmContext } from '../../App'
import AsyncStorage from '@react-native-community/async-storage'
import {
  getUpdatePackage,
  clearRealmStorage,
  applyPackageToStorage,
} from '../../utils/dataUtils'

const offlineStateTypes = ['none', 'unknown', 'NONE', 'UNKNOWN']

export default () => {
  const navigation = useNavigation()

  const realm = useContext(RealmContext)
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [languageCode, setLanguageCode] = useState<string | null>(null)
  const [noteList, setNoteList] = useState<Results<Notes> | null>(null)
  const [tasksList, setTasksList] = useState<Results<Tasks> | null>(null)
  const [memoriesList, setMemoriesList] = useState<Results<Memories> | null>(
    null
  )

  useEffect(() => {
    if (realm) {
      realm.addListener('change', realmListener)
    }
    return () => {
      realm?.removeListener('change', realmListener)
    }
  }, [])

  const realmListener = () => {
    const notes = realm
      ?.objects<Notes>('Notes')
      .filtered('changeType != 0')
      .sorted('updatedAt', true)
    const tasks = realm
      ?.objects<Tasks>('Tasks')
      .filtered('changeType != 0 AND completed == false')
      .sorted('dueTime')
    const memories = realm
      ?.objects<Memories>('Memories')
      .filtered('changeType != 0')
    const realmLanguageCode = realm?.objects<UserSession>('UserSession')?.[0]
      ?.language

    if (notes?.length) {
      setNoteList(notes)
    }

    if (tasks?.length) {
      setTasksList(tasks)
    }

    if (memories?.length) {
      setMemoriesList(memories)
    }
    if (realmLanguageCode && languageCode !== realmLanguageCode) {
      setLanguageCode(realmLanguageCode)
    }
  }

  useEffect(() => {
    if (realm) {
      const notes = realm
        .objects<Notes>('Notes')
        .filtered(`changeType != 0`)
        .sorted('updatedAt', true)
      const tasks = realm
        ?.objects<Tasks>('Tasks')
        .filtered('changeType != 0 AND completed == false')
        .sorted('dueTime')
      const memories = realm
        ?.objects<Memories>('Memories')
        .filtered('changeType != 0')

      if (notes?.length) {
        setNoteList(notes)
      }

      if (tasks?.length) {
        setTasksList(tasks)
      }

      if (memories?.length) {
        setMemoriesList(memories)
      }
    }
  }, [realm, navigation])

  const handleSynchronizePress = async () => {
    const netConnectionState = await NetInfo.fetch()
    if (offlineStateTypes.some((value) => value === netConnectionState.type)) {
      throw formatMessage('noInternet', realm)
    }
    try {
      setIsSynchronize(true)
      const accessToken = await AsyncStorage.getItem('access_token')
      const userId = await AsyncStorage.getItem('userId')
      const updatePackage = await getUpdatePackage()
      await fetch(`https://kevin.is.giestig.be/api/package/update-package`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatePackage),
      })
      realm && clearRealmStorage(realm)
      const response = await fetch(
        `https://kevin.is.giestig.be/api/package/get-package?id=${userId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': 'Cvqsam8axl8LTqzr0aT3L',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const responseJson = await response.json()
      applyPackageToStorage(responseJson)
    } catch (e) {
      console.log(e)
    }
    setIsSynchronize(false)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Clients')
  }

  const handleSpeechPress = () => {
    navigation.navigate('Speech')
  }

  const handleTextPress = () => {
    navigation.navigate('TextInput')
  }

  const renderNoteList = (item: Notes, index: number) => {
    if (item) {
      const props = {
        guid: item?.guid,
        message: item?.message,
        updatedAt: item?.updatedAt,
        index,
        parentGuid: item?.parentGuid,
        activityGuid: item?.activityGuid,
        changeType: item?.changeType,
      }
      return <ListCard key={index} {...props} />
    }
    return null
  }

  const renderMemory = (item) => (
    <ListCardMemory key={`memory-list-card-${item.guid}`} {...item} />
  )

  const renderTasksList = (item) => (
    <ListCardTask key={`task-list-card-${item.guid}`} {...item} />
  )

  const mapMemories = useMemo(
    () =>
      memoriesList &&
      memoriesList.slice(0, 5).map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        changeType: item.changeType,
      })),
    [memoriesList]
  )

  const mapTasks = useMemo(
    () =>
      tasksList &&
      tasksList.slice(0, 5).map((item) => ({
        guid: item.guid,
        title: item.title,
        description: item.description,
        completed: item.completed,
        completedAt: item.completedAt,
        dueTime: item.dueTime,
        changeType: item.changeType,
      })),
    [tasksList]
  )

  const mapNotes = useMemo(
    () => noteList && noteList.slice(0, 5).map(renderNoteList),
    [noteList]
  )

  return (
    <SignedInLayout
      headerTitle="Dashboard"
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      onLeftFlingGesture={handleLeftFlingGesture}
      activeTabIndex={0}>
      <ScrollView
        contentContainerStyle={{
          padding: Metrics.baseMargin,
        }}>
        <Header isFirst>
          <HeaderText>
            {formatMessage('addNote', realm).toUpperCase()}
          </HeaderText>
        </Header>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleSpeechPress}>
            <StyledButton
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                Colors.accentButtonColorLight,
                Colors.accentButtonColorDark,
              ]}>
              <Icon
                name="microphone"
                size={28}
                style={{
                  color: Colors.primaryTextLight,
                }}
              />
            </StyledButton>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTextPress}>
            <StyledButton
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                Colors.accentButtonColorLight,
                Colors.accentButtonColorDark,
              ]}>
              <Icon
                name="pencil"
                size={28}
                style={{
                  color: Colors.primaryTextLight,
                }}
              />
            </StyledButton>
          </TouchableOpacity>
        </View>
        {Boolean(tasksList?.length) && (
          <>
            <Header>
              <HeaderText>
                {formatMessage('uncompletedTasks', realm).toUpperCase()}
              </HeaderText>
            </Header>
            <View style={{ flex: 1 }}>{mapTasks?.map(renderTasksList)}</View>
          </>
        )}
        {Boolean(memoriesList?.length) && (
          <>
            <Header>
              <HeaderText>
                {formatMessage('thingsToRemember', realm).toUpperCase()}
              </HeaderText>
            </Header>
            <View style={{ flex: 1 }}>{mapMemories?.map(renderMemory)}</View>
          </>
        )}
        {Boolean(noteList?.length) && (
          <>
            <Header>
              <HeaderText>
                {formatMessage('recentNotes', realm).toUpperCase()}
              </HeaderText>
            </Header>
            <View style={{ flex: 1 }}>{mapNotes}</View>
          </>
        )}
      </ScrollView>
    </SignedInLayout>
  )
}
