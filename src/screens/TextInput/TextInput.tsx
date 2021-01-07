import React, { useState, useMemo, useEffect, useContext } from 'react'
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { Results } from 'realm'
import { format } from 'date-fns'
import { Guid } from 'guid-typescript'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { Clients } from '../../utils/storage'
import useRealm from 'utils/useRealm'
import { formatMessage } from '../../shared/formatMessage'
import { Colors, Metrics } from '../../themes'
import PickerItem from '../../shared/Picker/PickerItem'
import {
  Dropdown,
  DropdownTitle,
  Icon,
  ErrorText,
  StyledButton,
  Header,
  HeaderText,
  StyledTextInput,
} from './components'
import { Picker } from '../../shared'
import { RealmContext } from '../../App'

interface Error {
  client?: string
  message?: string
}

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { parentGuid, message, guid, changeType } = route?.params || {}
  const [search, setSearch] = useState<string>('')
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [error, setError] = useState<Error>({})

  const {
    objects: { clients },
    write,
  } = useRealm<{
    clients: Results<Clients>
  }>([{ object: 'Clients', name: 'clients', query: 'changeType != 0' }])

  useEffect(() => {
    if (parentGuid && clients) {
      const existingClients = clients?.find(
        (client) => client.guid === parentGuid
      )
      setSelectedItem(parentGuid)
      message && setText(message)
      existingClients &&
        setValue(`${existingClients.name} ${existingClients.lastName}`)
    } else if (!selectedItem && !value) {
      const getClientGuid = clients?.sorted('name')?.[0]?.guid
      const getClientName = clients?.find(
        (client) => client.guid === getClientGuid
      )
      getClientGuid && setSelectedItem(getClientGuid)
      getClientName &&
        setValue(`${getClientName.name} ${getClientName.lastName}`)
    }
  }, [clients])

  const handleHeaderIconAction = () => {
    navigation.goBack()
  }

  const handleSave = () => {
    if (selectedItem && text) {
      if (guid) {
        write((realmInstance: Realm) => {
          const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
          realmInstance.create(
            'Notes',
            {
              guid,
              changeType: changeType === 1 ? 1 : 2,
              parentGuid,
              message: text,
              updatedAt: now,
            },
            true
          )
        })
      } else {
        write((realmInstance: Realm) => {
          const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
          realmInstance.create(
            'Notes',
            {
              guid: String(Guid.create()).toUpperCase(),
              changeType: 1,
              parentGuid: selectedItem,
              message: text,
              createdAt: now,
              updatedAt: now,
            },
            true
          )
        })
      }
      setError({})
      navigation.navigate('ClientDetail', { userGuid: selectedItem })
    } else {
      if (!selectedItem) {
        setError({
          ...error,
          client: formatMessage('clientIsMandatory', realm),
        })
      }
      if (!text) {
        setError({
          ...error,
          message: formatMessage('messageIsMandatory', realm),
        })
      }
    }
  }

  const handleOnChangeText = (text: string) => {
    setText(text)
  }

  const handleSearchTextChange = (text: string) => {
    setSearch(text)
  }

  const handlePickerVisibilityChange = () => {
    if (!parentGuid) {
      setPickerVisible((prevState) => !prevState)
    }
  }

  const handleValueChange = (value: string | null) => {
    const hasClient = clients?.find((client) => client.guid === value)
    if (value && hasClient) {
      setSelectedItem(value)
      setValue(`${hasClient.name} ${hasClient.lastName}`)
    }
    handlePickerVisibilityChange()
  }

  const handleValuePress = (value: string | null) => () => {
    handleValueChange(value)
    handlePickerVisibilityChange()
  }

  const renderPickerItem = (
    item: { guid: string | null; name: string | null; lastName: string | null },
    index: number
  ) => (
    <PickerItem
      key={item.guid || 'none'}
      platform={Platform.OS}
      label={
        item.name && item.lastName
          ? `${item.name} ${item.lastName}`
          : formatMessage('unknown', realm)
      }
      value={item.guid}
      onPress={handleValuePress}
      index={index}
    />
  )

  const filterData = (data) => {
    return search.length
      ? data
          .filter((item) => {
            return (
              item?.name.toLowerCase().includes(search.toLowerCase()) ||
              item?.lastName.toLowerCase().includes(search.toLowerCase()) ||
              `${item?.name} ${item?.lastName}`
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              `${item?.lastName} ${item?.name}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
          })
          .sort((a, b) => a.name > b.name)
      : Array.from(data)?.sort((a, b) => a.name > b.name)
  }

  const options = useMemo(
    () => clients && filterData(clients).map(renderPickerItem),
    [clients, search]
  )

  return (
    <>
      <SignedInLayout
        headerTitle={
          guid
            ? formatMessage('updateNote', realm)
            : formatMessage('addNote', realm)
        }
        headerIcon="arrow-left"
        headerIconAction={handleHeaderIconAction}
        hideFooter>
        <View style={{ flex: 1, margin: Metrics.baseMargin }}>
          <TouchableOpacity onPress={handlePickerVisibilityChange}>
            <Dropdown>
              <DropdownTitle>
                {formatMessage('client', realm)}: {value}
              </DropdownTitle>
              {!parentGuid && <Icon name="chevron-down" size={24} />}
            </Dropdown>
          </TouchableOpacity>
          {Boolean(error?.client) && <ErrorText>* {error.client}</ErrorText>}
          <Header>
            <HeaderText>{`${formatMessage('note', realm)
              .charAt(0)
              .toUpperCase()}${formatMessage('note', realm).slice(
              1
            )}`}</HeaderText>
          </Header>
          <StyledTextInput
            style={{ height: 100, paddingTop: Metrics.baseMargin }}
            textAlignVertical="center"
            value={text}
            autoCapitalize="sentences"
            selectionColor={Colors.primaryText}
            onChangeText={handleOnChangeText}
            returnKeyType="next"
            multiline={true}
          />
          {Boolean(error?.message) && <ErrorText>* {error.message}</ErrorText>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity onPress={handleSave}>
              <StyledButton
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
                <Icon
                  name="plus"
                  size={18}
                  style={{
                    color: Colors.primaryTextLight,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    marginRight: Metrics.smallMargin,
                    color: Colors.primaryTextLight,
                  }}>
                  {formatMessage('addNote', realm).toUpperCase()}
                </Text>
              </StyledButton>
            </TouchableOpacity>
          </View>
        </View>
      </SignedInLayout>
      <Picker
        showSearch
        searchText={search}
        onSearchChange={handleSearchTextChange}
        visible={pickerVisible}
        selectedValue={selectedItem || ''}
        options={options}
        onValueChange={handleValueChange}
        onDismiss={handlePickerVisibilityChange}
      />
    </>
  )
}
