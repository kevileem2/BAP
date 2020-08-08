import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { StyledButton, Title, SubTitle, Icon } from './components'
import { Colors, Metrics } from '../../themes'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Results } from 'realm'
import { UserSession, Notes } from '../../utils/storage'
import useRealm from 'utils/useRealm'
import { formatMessage } from '../../shared/formatMessage'
import ListCard from './ListCard'
import { RealmContext } from '../../App'
import AsyncStorage from '@react-native-community/async-storage'
import {
  getUpdatePackage,
  clearRealmStorage,
  applyPackageToStorage,
} from '../../utils/dataUtils'

export default () => {
  const navigation = useNavigation()

  const realm = useContext(RealmContext)

  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [noteList, setNoteList] = useState<Notes[]>([])

  useEffect(() => {
    if (realm) {
      try {
        realm.addListener('change', () => {
          const notes = realm
            ?.objects<Notes>('Notes')
            .filtered('changeType != 0')
          if (notes?.length) {
            const endIndexNotes = notes?.length < 3 ? notes.length : 3
            setNoteList(notes.sorted('updatedAt', true).slice(0, endIndexNotes))
          } else {
            setNoteList([])
          }
        })
        const userSession = realm?.objects<UserSession>('UserSession')
        if (userSession?.[0].fullName) {
          setUserName(userSession[0].fullName)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [realm])

  const handleSynchronizePress = async () => {
    setIsSynchronize(true)
    try {
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
        changeType: item?.changeType,
      }
      return <ListCard key={index} {...props} />
    }
    return null
  }

  const mapNotes = useMemo(() => noteList && noteList.map(renderNoteList), [
    noteList,
    realm,
  ])

  return (
    <SignedInLayout
      headerTitle="Dashboard"
      showSynchronizeIcon
      showLogout
      isSynchronizing={isSynchronizing}
      handleSynchronizePress={handleSynchronizePress}
      onLeftFlingGesture={handleLeftFlingGesture}
      activeTabIndex={0}>
      <View
        style={{
          flex: 1,
          margin: Metrics.largeMargin,
        }}>
        {userName ? (
          <Title>
            {formatMessage('Welcome')}, {userName}!
          </Title>
        ) : (
          <Title>{formatMessage('Welcome')}!</Title>
        )}
        <SubTitle>{formatMessage('QuicklyAddNote')}</SubTitle>
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
        {Boolean(noteList.length) && (
          <>
            <View
              style={{
                borderBottomColor: Colors.buttonColorDark,
                borderBottomWidth: 2,
                alignSelf: 'flex-start',
                paddingBottom: Metrics.tinyMargin,
                marginTop: Metrics.largeMargin,
                marginBottom: Metrics.largeMargin,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 18,
                }}>
                {formatMessage('recentNotes')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>{mapNotes}</View>
          </>
        )}
      </View>
    </SignedInLayout>
  )
}
