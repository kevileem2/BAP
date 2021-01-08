import React, { useState, useEffect, useMemo, useContext } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native'
import { format } from 'date-fns'
import { Guid } from 'guid-typescript'
import Voice from 'react-native-voice'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { Results } from 'realm'
import { Activity, Clients } from '../../utils/storage'
import useRealm from 'utils/useRealm'

import { formatMessage, localeString } from '../../shared/formatMessage'
import message from '../../shared/message'
import {
  StyledButton,
  Icon,
  AdditionalInfo,
  AdditionalInfoTitle,
  Button,
  OutputContainer,
  MicrophoneIcon,
  Dropdown,
  DropdownTitle,
  ErrorText,
  Header,
  HeaderText,
  StyledTextInput,
} from './components'
import { Colors, Metrics } from '../../themes'
import { Portal, Modal } from 'react-native-paper'
import { ModalCard, ModalButtonsContainer } from '../../shared/components'
import { Picker } from '../../shared'
import PickerItem from '../../shared/Picker/PickerItem'
import { RealmContext } from '../../App'
import ModalCardRounded from '../../shared/ModalCardRounded'
import { useModal } from '../../utils/ModalProvider'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()

  const [pitch, setPitch] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [errors, setErrors] = useState<string>('')
  const [end, setEnd] = useState<boolean>(false)
  const [started, setStarted] = useState<boolean>(false)
  const [results, setResults] = useState<string>('')
  const [partialResults, setPartialResults] = useState<[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)
  const [activityPickerVisible, setActivityPickerVisible] = useState<boolean>(
    false
  )
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [clients, setClients] = useState<Results<Clients> | null>(null)
  const [activities, setActivities] = useState<Results<Activity> | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<{
    guid: string
    activity: string
  }>({ guid: 'none', activity: formatMessage('none', realm) })

  const { write } = useRealm<{}>([])

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechPartialResults = onSpeechPartialResults
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged
    if (realm) {
      try {
        realm.addListener('change', realmListener)
      } catch (e) {
        console.log(e)
      }
    }
    return () => {
      realm?.removeListener('change', realmListener)
      Voice.destroy().then(Voice.removeAllListeners)
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
    if (!selectedItem && !value && realmClients?.length) {
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
      if (!selectedItem && !value && realmClients?.length) {
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
        setActivities(realmActivities)
      }
    }
  }, [realm, navigation])

  const onSpeechStart = (e) => {
    setStarted(true)
  }

  const onSpeechEnd = (e) => {
    setStarted(false)
    setEnd(true)
  }

  const onSpeechError = async (e) => {
    Voice.destroy()
    await message({
      message: 'Something failed with Speech',
    })
  }

  const onSpeechResults = (e) => {
    setResults(e.value[0])
  }

  const onSpeechPartialResults = (e) => {
    setPartialResults(e.value[0])
  }

  const onSpeechVolumeChanged = (e) => {
    setPitch(e.value)
  }

  const startRecognizing = async () => {
    // Starts listening for speech for a specific locale
    setIsEditing(false)
    setPitch('')
    setError('')
    setStarted(false)
    setResults('')
    setPartialResults([])
    setEnd(false)

    try {
      await Voice.start(localeString(realm))
    } catch (e) {
      // eslint-disable-next-line
      console.error(e)
    }
  }

  const stopRecognizing = async () => {
    // Stops listening for speech
    try {
      await Voice.stop()
    } catch (e) {
      // eslint-disable-next-line
      console.error(e)
    }
  }

  const destroyRecognizer = async () => {
    // Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy()
    } catch (e) {
      // eslint-disable-next-line
      console.error(e)
    }
    setPitch('')
    setError('')
    setStarted(false)
    setResults('')
    setPartialResults([])
    setEnd(false)
  }

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState)
  }

  const handleModalVisibilityChange = () => {
    showModal(
      <ModalCardRounded
        title="instructions"
        icon="information-outline"
        iconColor={Colors.primary}
        confirmButtonText="ok"
        confirmButtonColor={Colors.accentButtonColorDark}
        handleConfirmAction={hideModal}
        hideCancelButton
        realm={realm}
        hideModal={hideModal}
        speech
      />
    )
  }

  const handleDelete = () => {
    setResults('')
    setPartialResults([])
  }

  const handleSave = () => {
    if (selectedItem) {
      write((realmInstance: Realm) => {
        const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
        realmInstance.create(
          'Notes',
          {
            guid: String(Guid.create()).toUpperCase(),
            changeType: 1,
            parentGuid: selectedItem,
            activityGuid:
              selectedActivity?.guid !== 'none' ? selectedActivity.guid : null,
            message: results,
            createdAt: now,
            updatedAt: now,
          },
          Realm.UpdateMode.All
        )
      })
      setErrors('')
      navigation.navigate('ClientDetail', { userGuid: selectedItem })
    } else {
      setErrors(formatMessage('clientIsMandatory', realm))
    }
  }

  const handleOnChangeText = (text: string) => {
    setResults(text)
  }

  const getEditButtonColors = () =>
    !isEditing
      ? [Colors.succesLight, Colors.succesDark]
      : [Colors.errorLight, Colors.errorDark]

  const handleSearchTextChange = (text: string) => {
    setSearch(text)
  }

  const handlePickerVisibilityChange = () => {
    setPickerVisible((prevState) => !prevState)
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
    handleActivityPickerChange()
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

  const filterData = (data) =>
    search.length
      ? data.filter(
          (item) =>
            item?.name.toLowerCase().includes(search.toLowerCase()) ||
            item?.lastName.toLowerCase().includes(search.toLowerCase()) ||
            `${item?.name} ${item?.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            `${item?.lastName} ${item?.name}`
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      : data

  const options = useMemo(
    () => clients && filterData(clients.sorted('name')).map(renderPickerItem),
    [clients, search]
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
        headerTitle={formatMessage('addNote', realm)}
        headerIcon="arrow-left"
        showInformation
        handleInformationPress={handleModalVisibilityChange}
        hideFooter>
        <View style={{ flex: 1, margin: Metrics.baseMargin }}>
          <TouchableOpacity onPress={handlePickerVisibilityChange}>
            <Dropdown>
              <DropdownTitle>
                {formatMessage('client', realm)}: {value}
              </DropdownTitle>
              <Icon name="chevron-down" size={24} />
            </Dropdown>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleActivityPickerChange}>
            <Dropdown>
              <DropdownTitle>
                {formatMessage('activity', realm)}: {selectedActivity?.activity}
              </DropdownTitle>
              <Icon name="chevron-down" size={24} />
            </Dropdown>
          </TouchableOpacity>
          {Boolean(errors) && <ErrorText>* {errors}</ErrorText>}
          <Header>
            <HeaderText>{`${formatMessage('note', realm)
              .charAt(0)
              .toUpperCase()}${formatMessage('note', realm).slice(
              1
            )}`}</HeaderText>
          </Header>
          <OutputContainer>
            {isEditing ? (
              <StyledTextInput
                value={results}
                autoCapitalize="none"
                selectionColor={Colors.primary}
                onChangeText={handleOnChangeText}
                returnKeyType="go"
                multiline
                style={{
                  width: '100%',
                  marginLeft: Metrics.smallMargin,
                }}
              />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  padding: Metrics.baseMargin,
                }}>
                <Text key={`result`}>{results || partialResults}</Text>
              </ScrollView>
            )}
          </OutputContainer>
          {Boolean(results.length) && end && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: isEditing ? 'center' : 'space-between',
                flexWrap: 'wrap',
              }}>
              <TouchableOpacity onPress={handleEdit}>
                <StyledButton
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={getEditButtonColors()}>
                  <Icon
                    name={isEditing ? 'close' : 'pencil'}
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
                    {isEditing
                      ? formatMessage('stopEditing', realm)
                      : formatMessage('edit', realm)}
                  </Text>
                </StyledButton>
              </TouchableOpacity>
              {!isEditing && (
                <>
                  <TouchableOpacity onPress={handleDelete}>
                    <StyledButton
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={[Colors.errorLight, Colors.errorDark]}>
                      <Icon
                        name="delete"
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
                        {formatMessage('delete', realm)}
                      </Text>
                    </StyledButton>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave}>
                    <StyledButton
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={[
                        Colors.buttonColorLight,
                        Colors.buttonColorDark,
                      ]}>
                      <Icon
                        name="content-save"
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
                        {formatMessage('save', realm)}
                      </Text>
                    </StyledButton>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          {!isEditing && (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              {!started ? (
                <View
                  style={{
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity onPress={startRecognizing}>
                    <StyledButton
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={[
                        Colors.accentButtonColorLight,
                        Colors.accentButtonColorDark,
                      ]}>
                      <MicrophoneIcon
                        name="microphone"
                        size={28}
                        style={{
                          color: Colors.primaryTextLight,
                        }}
                      />
                    </StyledButton>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{ alignSelf: 'center', justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    onPress={
                      Boolean(results.length)
                        ? stopRecognizing
                        : destroyRecognizer
                    }>
                    <StyledButton
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={[Colors.errorLight, Colors.errorDark]}>
                      <MicrophoneIcon
                        name="microphone-off"
                        size={28}
                        style={{
                          color: Colors.primaryTextLight,
                        }}
                      />
                    </StyledButton>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
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
