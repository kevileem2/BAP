import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { Clients, Notes } from '../../utils/storage'
import { Metrics, Colors } from '../../themes'
import { formatMessage } from '../../shared'
import { RealmContext } from '../../App'
import {
  IconHeader,
  IconHeaderContainer,
  Container,
  IconHeaderContainerWrapper,
} from './components'
import { Results } from 'realm'
import { ContainerBody } from './components'
import ListNote from './ListNote'
import useRealm from 'utils/useRealm'

export default ({ route }) => {
  const navigation = useNavigation()
  const userGuid = route.params?.userGuid
  const [client, setClient] = useState<Clients | null>(null)
  const [notes, setNotes] = useState<Results<Notes> | null>(null)

  const realm = useContext(RealmContext)

  const {
    objects: {},
    write,
  } = useRealm([])

  useEffect(() => {
    if (realm) {
      setClient(
        realm.objects<Clients>('Clients').filtered(`guid == "${userGuid}"`)?.[0]
      )
      setNotes(
        realm.objects<Notes>('Notes').filtered(`parentGuid == "${userGuid}"`)
      )
    }
  }, [realm])

  const handleHeaderIconAction = () => {
    navigation.navigate('Clients')
  }

  const handleEditPress = () => {
    navigation.navigate('AddClient', {
      userGuid,
    })
  }
  const handleDeletePress = () => {
    try {
      if (client) {
        if (client?.changeType === 1) {
          write((realmInstance: Realm) => {
            realmInstance.delete(
              realm
                .objects<Clients>('Clients')
                .filtered(`guid == "${userGuid}"`)
            )
          })
        } else {
          write((realmInstance: Realm) => {
            realmInstance.create(
              'Clients',
              {
                guid: client.guid,
                changeType: 0,
              },
              Realm.UpdateMode.All
            )
          })
        }
        const getNoteswithChangeTypeNew = realm
          .objects<Notes>('Notes')
          .filtered(`parentGuid == "${userGuid}" AND changeType == 1`)
        const getNotesWithoutChangeTypeNew = realm
          .objects<Notes>('Notes')
          .filtered(`parentGuid == "${userGuid}" AND changeType != 1`)

        if (getNoteswithChangeTypeNew.length) {
          write((realmInstance: Realm) => {
            realmInstance.delete(getNoteswithChangeTypeNew)
          })
        }
        if (getNotesWithoutChangeTypeNew.length) {
          getNotesWithoutChangeTypeNew.forEach((note) => {
            write((realmInstance: Realm) => {
              realmInstance.create(
                'Notes',
                {
                  guid: note.guid,
                  changeType: 0,
                },
                Realm.UpdateMode.All
              )
            })
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
    navigation.goBack()
  }

  // renders each contact with props
  const renderNotes = (item: Notes, index: number) => {
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

  const mapNotes = useMemo(() => notes?.map(renderNotes), [notes, realm])

  return (
    <SignedInLayout
      headerTitle={`${client?.name} ${client?.lastName}`}
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      showEdit
      handleEditPress={handleEditPress}
      showDelete
      handleDeletePress={handleDeletePress}
      hideFooter>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingBottom: Metrics.smallMargin,
          overflow: 'visible',
        }}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          contentContainerStyle={{ padding: Metrics.largeMargin }}>
          <Container>
            <IconHeaderContainerWrapper>
              <IconHeaderContainer
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[
                  Colors.accentButtonColorLight,
                  Colors.accentButtonColorDark,
                ]}>
                <IconHeader name="account" size={32} />
              </IconHeaderContainer>
            </IconHeaderContainerWrapper>
            <ContainerBody>
              <View
                style={{
                  width: '100%',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                <Text style={{ fontWeight: '700' }}>{`${
                  formatMessage('name').charAt(0).toUpperCase() +
                  formatMessage('name').slice(1)
                }: `}</Text>
                <Text>{`${client?.name} ${client?.lastName}`}</Text>
              </View>
              {client?.age && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('age').charAt(0).toUpperCase() +
                    formatMessage('age').slice(1)
                  }: `}</Text>
                  <Text>{`${client.age}`}</Text>
                </View>
              )}
              {client?.room && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('room').charAt(0).toUpperCase() +
                    formatMessage('room').slice(1)
                  }: `}</Text>
                  <Text>{`${client.room}`}</Text>
                </View>
              )}
              {client?.description && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('description').charAt(0).toUpperCase() +
                    formatMessage('description').slice(1)
                  }: `}</Text>
                  <Text>{`${client.description}`}</Text>
                </View>
              )}
            </ContainerBody>
          </Container>
          <Container>
            <IconHeaderContainerWrapper>
              <IconHeaderContainer
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[Colors.succesLight, Colors.succesDark]}>
                <IconHeader name="pencil" size={32} />
              </IconHeaderContainer>
            </IconHeaderContainerWrapper>
            <ContainerBody>{mapNotes}</ContainerBody>
          </Container>
        </ScrollView>
      </View>
    </SignedInLayout>
  )
}
