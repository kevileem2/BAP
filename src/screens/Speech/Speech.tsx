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
import { Clients } from '../../utils/storage'
import useRealm from 'utils/useRealm'

import { formatMessage, localeString } from '../../shared/formatMessage'
import message from '../../shared/message'
import {
  StyledButton,
  Icon,
  Title,
  SubTitle,
  AdditionalInfo,
  AdditionalInfoTitle,
  Button,
  OutputContainer,
  OutputTitle,
  MicrophoneIcon,
  Dropdown,
  DropdownTitle,
  ErrorText,
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
  const [modalVisible, setModalVisibilityChange] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const {
    objects: { clients },
    write,
  } = useRealm<{
    clients: Results<Clients>
  }>([{ object: 'Clients', name: 'clients', query: 'changeType != 0' }])

  useEffect(() => {
    if (!selectedItem && !value) {
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

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechPartialResults = onSpeechPartialResults
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged
    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

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
    //Starts listening for speech for a specific locale
    setIsEditing(false)
    setPitch('')
    setError('')
    setStarted(false)
    setResults('')
    setPartialResults([])
    setEnd(false)

    try {
      await Voice.start(localeString())
    } catch (e) {
      //eslint-disable-next-line
      console.error(e)
    }
  }

  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop()
    } catch (e) {
      //eslint-disable-next-line
      console.error(e)
    }
  }

  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel()
    } catch (e) {
      //eslint-disable-next-line
      console.error(e)
    }
  }

  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy()
    } catch (e) {
      //eslint-disable-next-line
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
    () => clients && filterData(clients).map(renderPickerItem),
    [clients, search]
  )

  return (
    <>
      <SignedInLayout
        headerTitle={formatMessage('addNote', realm)}
        headerIcon="arrow-left"
        headerIconAction={handleHeaderIconAction}
        showInformation
        handleInformationPress={handleModalVisibilityChange}
        hideFooter>
        <View style={{ flex: 1, margin: Metrics.baseMargin }}>
          <Title>{formatMessage('speechNoteTitle', realm)}</Title>
          <SubTitle>{formatMessage('speechNoteSubtitle', realm)}</SubTitle>
          <OutputTitle>Output</OutputTitle>
          <TouchableOpacity onPress={handlePickerVisibilityChange}>
            <Dropdown>
              <DropdownTitle>
                {formatMessage('client', realm)}: {value}
              </DropdownTitle>
              <Icon name="chevron-down" size={24} />
            </Dropdown>
          </TouchableOpacity>
          {Boolean(errors) && <ErrorText>* {errors}</ErrorText>}
          <OutputContainer>
            {isEditing ? (
              <TextInput
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
              <ScrollView>
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
      <Portal>
        <Modal visible={modalVisible} onDismiss={handleModalVisibilityChange}>
          <ModalCard>
            <AdditionalInfoTitle>
              {formatMessage('instructions', realm)}:
            </AdditionalInfoTitle>
            <AdditionalInfo>
              • {formatMessage('speakClearly', realm)}
            </AdditionalInfo>
            <AdditionalInfo>
              • {formatMessage('recordNoteCompletely', realm)}
            </AdditionalInfo>
            <AdditionalInfo>
              • {formatMessage('speakPunctuation', realm)}
            </AdditionalInfo>
            <AdditionalInfo>
              • {formatMessage('punctuationExample', realm)}
            </AdditionalInfo>
            <ModalButtonsContainer>
              <TouchableOpacity onPress={handleModalVisibilityChange}>
                <Button
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
                  <Text
                    style={{
                      color: Colors.primaryTextLight,
                      fontWeight: '500',
                    }}>
                    OK
                  </Text>
                </Button>
              </TouchableOpacity>
            </ModalButtonsContainer>
          </ModalCard>
        </Modal>
      </Portal>
    </>
  )
}
