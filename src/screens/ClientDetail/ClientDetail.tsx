import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
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
import useRealm from '../../utils/useRealm'
import { StyledButton, Icon } from '../Dashboard/components'

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
    realm?.addListener('change', () => {
      setClient(
        realm.objects<Clients>('Clients').filtered(`guid == "${userGuid}"`)?.[0]
      )
      setNotes(
        realm.objects<Notes>('Notes').filtered(`parentGuid == "${userGuid}"`)
      )
    })
  }, [])

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
    navigation.navigate('Clients')
  }

  const handleAddNotePress = () => {
    navigation.navigate('TextInput', {
      parentGuid: client?.guid,
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
                  formatMessage('name', realm).charAt(0).toUpperCase() +
                  formatMessage('name', realm).slice(1)
                }: `}</Text>
                <Text>{`${client?.name} ${client?.lastName}`}</Text>
              </View>
              {Boolean(client?.age) && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('age', realm).charAt(0).toUpperCase() +
                    formatMessage('age', realm).slice(1)
                  }: `}</Text>
                  <Text>{`${client?.age}`}</Text>
                </View>
              )}
              {Boolean(client?.room) && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('room', realm).charAt(0).toUpperCase() +
                    formatMessage('room', realm).slice(1)
                  }: `}</Text>
                  <Text>{`${client?.room}`}</Text>
                </View>
              )}
              {Boolean(client?.description) && (
                <View
                  style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontWeight: '700' }}>{`${
                    formatMessage('description', realm)
                      .charAt(0)
                      .toUpperCase() +
                    formatMessage('description', realm).slice(1)
                  }: `}</Text>
                  <Text>{`${client?.description}`}</Text>
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
            <ContainerBody>{mapNotes && mapNotes}</ContainerBody>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={handleAddNotePress}>
                <StyledButton
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={[Colors.buttonColorLight, Colors.buttonColorDark]}
                  style={{ marginBottom: 0 }}>
                  <Icon name="plus" size={18} color={Colors.primaryTextLight} />
                </StyledButton>
              </TouchableOpacity>
            </View>
          </Container>
        </ScrollView>
      </View>
    </SignedInLayout>
  )
}
