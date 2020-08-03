import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
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

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)

  const {
    objects: { clients },
  } = useRealm<{
    clients: Results<Clients>
  }>([{ object: 'Clients', name: 'clients', query: 'changeType != 0' }])

  useEffect(() => {
    navigation.addListener('focus', handleRefetch(true))
    navigation.addListener('blur', handleRefetch(false))
  }, [])

  const handleRefetch = (refetch: boolean) => () => {
    setShouldRefetch(refetch)
  }

  const handleSynchronizePress = () => {
    setIsSynchronize(true)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Profile')
  }

  const handleRightFlingGesture = () => {
    navigation.navigate('Dashboard')
  }

  const [searchText, setSearchText] = useState<string>('')

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
    ({ item, index }) => {
      return renderContacts({ item, index })
    },
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
    [clients, shouldRefetch]
  )

  const handleAddClientPress = () => {
    navigation.navigate('AddClient')
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('clients')}
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      showAddIcon={Boolean(clients?.length)}
      handleSynchronizePress={handleSynchronizePress}
      handleAddPress={handleAddClientPress}
      onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={1}>
      <View style={{ flex: 1 }}>
        {Boolean(clients?.length) ? (
          <>
            <SearchBarStyled
              placeholder={formatMessage('search')}
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
            <NoClientsInfo>{formatMessage('noClientsYet')}</NoClientsInfo>
            <NoClientsInfoSubTitle>
              {formatMessage('addClients')}
            </NoClientsInfoSubTitle>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={handleAddClientPress}>
                <StyledButton
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={[Colors.succesLight, Colors.succesDark]}>
                  <Icon
                    name="plus"
                    size={28}
                    style={{
                      color: Colors.primaryTextLight,
                    }}
                  />
                </StyledButton>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SignedInLayout>
  )
}
