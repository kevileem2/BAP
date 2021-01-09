import React, { useState, useMemo, useEffect, useContext } from 'react'
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import { Results } from 'realm'
import { format } from 'date-fns'
import { Guid } from 'guid-typescript'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { Activity, Clients } from '../../utils/storage'
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
import { ScrollView } from 'react-native-gesture-handler'

interface Error {
  client?: string
  message?: string
}

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { parentGuid, message, guid, changeType, activityGuid } =
    route?.params || {}
  const [search, setSearch] = useState<string>('')
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)
  const [activityPickerVisible, setActivityPickerVisible] = useState<boolean>(
    false
  )
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [error, setError] = useState<Error>({})
  const [clients, setClients] = useState<Results<Clients> | null>(null)
  const [activities, setActivities] = useState<Results<Activity> | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<{
    guid: string
    activity: string
  }>({ guid: 'none', activity: formatMessage('none', realm) })

  const { write } = useRealm<{}>([])

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
    const realmActivities = realm
      ?.objects<Activity>('Activity')
      .filtered(`changeType != 0`)
    const realmClients = realm
      ?.objects<Clients>('Clients')
      .filtered(`changeType != 0`)
    if (realmClients?.length) {
      setClients(realmClients)
    }
    if (parentGuid && realmClients?.length) {
      const existingClients = realmClients?.find(
        (client) => client.guid === parentGuid
      )
      setSelectedItem(parentGuid)
      if (message) {
        setText(message)
      }
      if (existingClients) {
        setValue(`${existingClients.name} ${existingClients.lastName}`)
      }
    } else if (!selectedItem && !value && realmClients?.length) {
      const getClientGuid = realmClients.sorted('name')?.[0]?.guid
      const getClientName = realmClients.find(
        (client) => client.guid === getClientGuid
      )
      if (getClientGuid && getClientName) {
        setSelectedItem(getClientGuid)
        setValue(`${getClientName.name} ${getClientName.lastName}`)
      }
    }
    if (realmActivities?.length) {
      if (activityGuid) {
        const getActivity = realmActivities.find(
          (el) => el.guid === activityGuid
        )
        if (getActivity?.activity) {
          setSelectedActivity({
            guid: activityGuid,
            activity: getActivity.activity,
          })
        }
      }
      setActivities(realmActivities)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmActivities = realm
        ?.objects<Activity>('Activity')
        .filtered(`changeType != 0`)
      const realmClients = realm
        ?.objects<Clients>('Clients')
        .filtered(`changeType != 0`)
      if (realmClients?.length) {
        setClients(realmClients)
      }
      if (parentGuid && realmClients?.length) {
        const existingClients = realmClients.find(
          (client) => client.guid === parentGuid
        )
        setSelectedItem(parentGuid)
        if (message) {
          setText(message)
        }
        if (existingClients) {
          setValue(`${existingClients.name} ${existingClients.lastName}`)
        }
      } else if (!selectedItem && !value && realmClients?.length) {
        const getClientGuid = realmClients.sorted('name')?.[0]?.guid
        const getClientName = realmClients.find(
          (client) => client.guid === getClientGuid
        )
        if (getClientGuid && getClientName) {
          setSelectedItem(getClientGuid)
          setValue(`${getClientName.name} ${getClientName.lastName}`)
        }
      }
      if (realmActivities?.length) {
        if (activityGuid) {
          const getActivity = realmActivities.find(
            (el) => el.guid === activityGuid
          )
          if (getActivity?.activity) {
            setSelectedActivity({
              guid: activityGuid,
              activity: getActivity.activity,
            })
          }
        }
        setActivities(realmActivities)
      }
    }
  }, [realm, navigation])

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
              activityGuid:
                selectedActivity?.guid !== 'none'
                  ? selectedActivity.guid
                  : null,
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
              activityGuid:
                selectedActivity?.guid !== 'none'
                  ? selectedActivity.guid
                  : null,
              message: text,
              createdAt: now,
              updatedAt: now,
            },
            true
          )
        })
      }
      setError({})
      navigation.goBack()
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

  const handleValueChange = (valueString: string | null) => {
    const hasClient = clients?.find((client) => client.guid === valueString)
    if (valueString && hasClient) {
      setSelectedItem(valueString)
      setValue(`${hasClient.name} ${hasClient.lastName}`)
    }
    handlePickerVisibilityChange()
  }

  const handleValuePress = (valueString: string | null) => () => {
    handleValueChange(valueString)
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

  const handleActivityPickerChange = () => {
    setActivityPickerVisible((prevState) => !prevState)
  }

  const handleActivityValueChange = (valueString: string | null) => {
    const hasActivity = activities?.find(
      (activity) => activity.guid === valueString
    )
    if (valueString && hasActivity) {
      setSelectedActivity({
        guid: valueString,
        activity: hasActivity.activity!,
      })
    } else {
      setSelectedActivity({
        guid: 'none',
        activity: formatMessage('none', realm),
      })
    }
    handleActivityPickerChange()
  }

  const handleActivityChange = (valueString: string | null) => () => {
    handleActivityValueChange(valueString)
  }

  const renderActivityPicker = (
    item: { guid: string; activity: string | null },
    index: number
  ) => (
    <PickerItem
      key={item.guid}
      platform={Platform.OS}
      label={item.activity || ''}
      value={item.guid}
      onPress={handleActivityChange}
      index={index}
    />
  )

  const activityOptions = useMemo(() => {
    if (activities) {
      let mappedActivities = activities.sorted('activity').map((item) => ({
        guid: item.guid,
        activity: item.activity,
      }))
      mappedActivities = [
        { guid: 'none', activity: formatMessage('none', realm) },
        ...mappedActivities,
      ]
      return mappedActivities && mappedActivities.map(renderActivityPicker)
    }
    return []
  }, [activities])

  return (
    <>
      <SignedInLayout
        headerTitle={
          guid
            ? formatMessage('updateNote', realm)
            : formatMessage('addNote', realm)
        }
        headerIcon="arrow-left"
        hideFooter>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: Metrics.baseMargin }}>
            <TouchableOpacity onPress={handlePickerVisibilityChange}>
              <Dropdown>
                <DropdownTitle>
                  {formatMessage('client', realm)}: {value}
                </DropdownTitle>
                {!parentGuid && <Icon name="chevron-down" size={24} />}
              </Dropdown>
            </TouchableOpacity>
            {Boolean(error?.client) && <ErrorText>* {error.client}</ErrorText>}
            <TouchableOpacity onPress={handleActivityPickerChange}>
              <Dropdown>
                <DropdownTitle>
                  {formatMessage('activity', realm)}:{' '}
                  {selectedActivity?.activity}
                </DropdownTitle>
                <Icon name="chevron-down" size={24} />
              </Dropdown>
            </TouchableOpacity>
            <Header>
              <HeaderText>{`${formatMessage('note', realm)
                .charAt(0)
                .toUpperCase()}${formatMessage('note', realm).slice(
                1
              )}`}</HeaderText>
            </Header>
            <StyledTextInput
              style={{
                height: 100,
                paddingTop: Metrics.baseMargin,
                fontSize: 16,
              }}
              textAlignVertical="top"
              value={text}
              autoCapitalize="sentences"
              selectionColor={Colors.primaryText}
              onChangeText={handleOnChangeText}
              returnKeyType="next"
              multiline={true}
            />
            {Boolean(error?.message) && (
              <ErrorText>* {error.message}</ErrorText>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: Metrics.largeMargin,
                marginRight: Metrics.smallMargin,
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
                    {guid
                      ? formatMessage('updateNote', realm).toUpperCase()
                      : formatMessage('addNote', realm).toUpperCase()}
                  </Text>
                </StyledButton>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
      <Picker
        visible={activityPickerVisible}
        selectedValue={selectedActivity.guid}
        options={activityOptions}
        onValueChange={handleActivityValueChange}
        onDismiss={handleActivityPickerChange}
      />
    </>
  )
}
