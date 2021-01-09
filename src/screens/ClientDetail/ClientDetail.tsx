import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Results } from 'realm'
import SignedInLayout from '../../shared/SignedInStack'
import { Activity, Clients, Notes } from '../../utils/storage'
import { Metrics } from '../../themes'
import { RealmContext } from '../../App'
import ListNote from './ListNote'
import {
  Dropdown,
  DropdownTitle,
  Icon,
  NoNotes,
  NoNotesSubTitle,
} from './components'
import { formatMessage, Picker } from '../../shared'
import PickerItem from '../../shared/Picker/PickerItem'

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const userGuid = route.params?.userGuid
  const [client, setClient] = useState<Clients | null>(null)
  const [notes, setNotes] = useState<Results<Notes> | null>(null)
  const [activities, setActivities] = useState<Results<Activity> | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedActivity, setSelectedActivity] = useState<{
    guid: string
    activity: string
  }>({ guid: 'none', activity: formatMessage('none', realm) })
  const [pickerVisible, setPickerVisible] = useState<boolean>(false)

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
      setActivities(realm?.objects<Activity>('Activity'))
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
      setActivities(realm?.objects<Activity>('Activity'))
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
    const activityName = realm
      ?.objects<Activity>('Activity')
      .filtered(`guid == "${item.activityGuid}"`)?.[0]?.activity
    if (item) {
      const props = {
        guid: item.guid,
        message: item.message,
        updatedAt: item.updatedAt,
        activity: activityName,
        activityGuid: item.activityGuid,
        index,
        changeType: item.changeType,
        parentGuid: item.parentGuid,
      }
      return <ListNote key={`contact-list-card-${index}`} {...props} />
    }
    return null
  }

  const mapNotes = useMemo(() => {
    if (selectedActivity?.guid === 'none' && notes) {
      return notes
        .filtered('changeType != 0')
        .sorted('updatedAt', true)
        ?.map(renderNotes)
    } else {
      return notes
        ?.filtered(
          `changeType != 0 AND activityGuid == "${selectedActivity?.guid}"`
        )
        .sorted('updatedAt', true)
        ?.map(renderNotes)
    }
  }, [notes, realm, selectedActivity])

  const handlePickerVisibilityPress = () => {
    setPickerVisible((prevState) => !prevState)
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
    handlePickerVisibilityPress()
  }

  const handleActivityChange = (valueString: string | null) => () => {
    handleActivityValueChange(valueString)
    handlePickerVisibilityPress()
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

  const options = useMemo(() => {
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
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              paddingHorizontal: Metrics.baseMargin,
            }}>
            <TouchableOpacity onPress={handlePickerVisibilityPress}>
              <Dropdown>
                <DropdownTitle>
                  {formatMessage('activity', realm)}:{' '}
                  {selectedActivity?.activity}
                </DropdownTitle>
                <Icon name="chevron-down" size={24} />
              </Dropdown>
            </TouchableOpacity>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
              }}
              keyboardShouldPersistTaps="handled">
              {mapNotes && mapNotes}
            </ScrollView>
          </View>
        ) : (
          <View style={{ padding: Metrics.baseMargin }}>
            <NoNotes>{formatMessage('noNotesYet', realm)}</NoNotes>
            <NoNotesSubTitle>
              {formatMessage('noNotesYetSubTitle', realm)}
            </NoNotesSubTitle>
          </View>
        )}
      </SignedInLayout>
      <Picker
        visible={pickerVisible}
        selectedValue={selectedActivity.guid || ''}
        options={options}
        onValueChange={handleActivityValueChange}
        onDismiss={handlePickerVisibilityPress}
      />
    </>
  )
}
