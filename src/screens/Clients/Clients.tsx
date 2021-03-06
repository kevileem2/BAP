import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage, message } from '../../shared'
import useRealm from '../../utils/useRealm'
import { Clients } from '../../utils/storage'
import {
  SearchBarStyled,
  ListContainer,
  NoClientsInfo,
  NoClientsInfoSubTitle,
  Icon,
} from './components'
import ListCard from './ListCard'
import { StyledButton } from '../Dashboard/components'
import { Colors } from '../../themes'
import {
  applyPackageToStorage,
  clearRealmStorage,
  getUpdatePackage,
} from '../../utils/dataUtils'
import AsyncStorage from '@react-native-community/async-storage'
import { RealmContext } from '../../App'

const offlineStateTypes = ['none', 'unknown', 'NONE', 'UNKNOWN']

export default () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState<boolean>(true)
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [clients, setClients] = useState<Results<Clients> | null>(null)

  const realm = useContext(RealmContext)

  useEffect(() => {
    realm?.addListener('change', realmListener)
    setLoading(false)
    return () => {
      realm?.removeListener('change', realmListener)
    }
  }, [])

  const realmListener = () => {
    if (realm) {
      const clientQuestions = realm
        .objects<Clients>('Clients')
        .filtered(`changeType != 0`)
      setClients(clientQuestions)
    }
  }

  useEffect(() => {
    if (realm) {
      const clientQuestions = realm
        .objects<Clients>('Clients')
        .filtered(`changeType != 0`)
      setClients(clientQuestions)
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
      await message({ message: e, realm })
    }
    setIsSynchronize(false)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Profile')
  }

  const handleRightFlingGesture = () => {
    navigation.navigate('Dashboard')
  }

  // handles the search text change
  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  // key extractor for the Flatlist, keyExtractor tells the list to use the ids for the react keys instead of the default key property.
  const getKeyExtractor = (item, index) => index.toString()

  // filters the list on all the available data from the user
  const filterData = (data) =>
    searchText.length
      ? data
          .filter((item) =>
            Object.values(item).some(
              (value) =>
                typeof value === 'string' &&
                value.toLowerCase().includes(searchText.toLowerCase())
            )
          )
          .sort((a, b) => a.name > b.name)
      : data.sort((a, b) => a.name > b.name)

  // renders each contact with props
  const renderContacts = ({ item, index }) => {
    const client = clients?.find((record) => record.guid === item.guid)
    return (
      <ListCard
        key={`contact-list-card-${item.id}`}
        {...item}
        client={client}
      />
    )
  }

  // use callback for rendering the contacts
  const renderItemCall = useCallback(
    ({ item, index }) => renderContacts({ item, index }),
    [clients]
  )

  // use memo for mapping the contacts
  const mapContactsData = useMemo(
    () =>
      clients &&
      clients.sorted('name').map((item) => ({
        guid: item.guid,
        id: item.id,
        changeType: item.changeType,
        name: item.name,
        lastName: item.lastName,
      })),
    [clients]
  )

  const handleAddClientPress = () => {
    navigation.navigate('AddClient')
  }

  const handleIntakeFormPress = () => {
    navigation.navigate('IntakeForm')
  }

  const handleActivityPress = () => {
    navigation.navigate('Activity')
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('clients', realm)}
      showSynchronizeIcon
      showIntakeFormIcon
      showActivityIcon
      isSynchronizing={isSynchronizing}
      showAddIcon
      handleSynchronizePress={handleSynchronizePress}
      handleAddPress={handleAddClientPress}
      handleIntakeFormPress={handleIntakeFormPress}
      handleAddActivityPress={handleActivityPress}
      onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={1}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {!loading &&
          (Boolean(clients?.length) ? (
            <>
              <SearchBarStyled
                placeholder={formatMessage('search', realm)}
                onChangeText={handleSearchChange}
                value={searchText}
              />
              <ListContainer
                keyboardShouldPersistTaps="handled"
                data={filterData(mapContactsData)}
                renderItem={renderItemCall}
                keyExtractor={getKeyExtractor}
                extraData={{ clients }}
              />
            </>
          ) : (
            <>
              <NoClientsInfo>
                {formatMessage('noClientsYet', realm)}
              </NoClientsInfo>
              <NoClientsInfoSubTitle>
                {formatMessage('noClientsYetSubTitle', realm)}
              </NoClientsInfoSubTitle>
            </>
          ))}
      </KeyboardAvoidingView>
    </SignedInLayout>
  )
}
