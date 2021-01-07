import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Results } from 'realm'
import SignedInLayout from '../../shared/SignedInStack'
import { Clients, Notes } from '../../utils/storage'
import { Metrics, Colors } from '../../themes'
import { RealmContext } from '../../App'
import ListNote from './ListNote'
import useRealm from '../../utils/useRealm'
import { NoNotes, NoNotesSubTitle } from './components'
import { formatMessage } from '../../shared'

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const userGuid = route.params?.userGuid
  const [client, setClient] = useState<Clients | null>(null)
  const [notes, setNotes] = useState<Results<Notes> | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    realm?.addListener('change', realmListener)
    setLoading(false)
    return () => {
      realm?.removeListener('change', realmListener)
    }
  }, [])

  const realmListener = () => {
    if (realm) {
      setClient(
        realm
          ?.objects<Clients>('Clients')
          .filtered(`guid == "${userGuid}"`)?.[0]
      )
      setNotes(
        realm?.objects<Notes>('Notes').filtered(`parentGuid == "${userGuid}"`)
      )
    }
  }

  useEffect(() => {
    if (realm) {
      setClient(
        realm.objects<Clients>('Clients').filtered(`guid == "${userGuid}"`)?.[0]
      )
      setNotes(
        realm.objects<Notes>('Notes').filtered(`parentGuid == "${userGuid}"`)
      )
    }
  }, [realm, navigation])

  const handleHeaderIconAction = () => {
    navigation.navigate('Clients')
  }

  const handleEditPress = () => {
    navigation.navigate('AddClient', {
      userGuid,
    })
  }

  const handleAddNotePress = () => {
    navigation.navigate('TextInput', {
      parentGuid: client?.guid,
    })
  }

  const handleInformationPress = () => {
    navigation.navigate('ClientIntakeForm', {
      parent: client,
    })
  }

  // renders each contact with props
  const renderNotes = (item: Notes, index: number) => {
    if (item) {
      const props = {
        guid: item.guid,
        message: item.message,
        updatedAt: item.updatedAt,
        index,
        changeType: item.changeType,
        parentGuid: item.parentGuid,
      }
      return <ListNote key={`contact-list-card-${index}`} {...props} />
    }
    return null
  }

  const mapNotes = useMemo(
    () =>
      notes &&
      notes
        .filtered('changeType != 0')
        .sorted('updatedAt', true)
        ?.map(renderNotes),
    [notes, realm]
  )

  return (
    <SignedInLayout
      headerTitle={`${client?.name} ${client?.lastName}`}
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      showEdit
      handleEditPress={handleEditPress}
      showAddNoteIcon
      handleAddNotePress={handleAddNotePress}
      showInformation
      handleInformationPress={handleInformationPress}
      hideFooter>
      {loading ? null : notes?.length ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            padding: Metrics.baseMargin,
          }}
          keyboardShouldPersistTaps="handled">
          {mapNotes && mapNotes}
        </ScrollView>
      ) : (
        <View style={{ padding: Metrics.baseMargin }}>
          <NoNotes>{formatMessage('noNotesYet', realm)}</NoNotes>
          <NoNotesSubTitle>
            {formatMessage('noNotesYetSubTitle', realm)}
          </NoNotesSubTitle>
        </View>
      )}
    </SignedInLayout>
  )
}
