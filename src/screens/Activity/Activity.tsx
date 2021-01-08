import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react'
import { View } from 'react-native'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import { useModal } from '../../utils/ModalProvider'
import { RealmContext } from '../../App'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import { Activity } from '../../utils/storage'
import { ListContainer, NoActivities, NoActivitiesSubTitle } from './components'
import ListCard from './ListCard'
import useRealm from '../../utils/useRealm'
import ActivityModal from './ActivityModal'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()
  const [loading, setLoading] = useState<boolean>(true)
  const [activities, setActivities] = useState<Results<Activity> | null>(null)

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
    if (realmActivities?.length) {
      setActivities(realmActivities)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmActivities = realm
        ?.objects<Activity>('Activity')
        .filtered(`changeType != 0`)
      if (realmActivities?.length) {
        setActivities(realmActivities)
      }
    }
  }, [realm, navigation])

  useEffect(() => {
    setLoading(false)
  }, [])

  // key extractor for the Flatlist, keyExtractor tells the list to use the ids for the react keys instead of the default key property.
  const getKeyExtractor = (item, index) => index.toString()

  // // renders each question with props
  const renderActivity = ({ item, index }) => (
    <ListCard key={`question-list-card-${item.guid}`} {...item} />
  )

  // use callback for rendering the contacts
  const renderItemCall = useCallback(
    ({ item, index }) => renderActivity({ item, index }),
    [activities]
  )

  // use memo for mapping the questions
  const mapQuestions = useMemo(
    () =>
      activities &&
      activities.sorted('activity').map((item) => ({
        guid: item.guid,
        activity: item.activity,
        changeType: item.changeType,
      })),
    [activities]
  )

  const handleModalVisibilityChange = () => {
    showModal(
      <ActivityModal hideModal={hideModal} realm={realm} write={write} />
    )
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('activities', realm)}
      headerIcon="arrow-left"
      showAddIcon
      handleAddPress={handleModalVisibilityChange}
      hideFooter>
      <View style={{ flex: 1 }}>
        {loading ? null : activities?.length ? (
          <ListContainer
            keyboardShouldPersistTaps="handled"
            data={mapQuestions}
            renderItem={renderItemCall}
            keyExtractor={getKeyExtractor}
            extraData={{ activities }}
          />
        ) : (
          <>
            <NoActivities>
              {formatMessage('noActivitiesYet', realm)}
            </NoActivities>
            <NoActivitiesSubTitle>
              {formatMessage('noActivitiesYetSubTitle', realm)}
            </NoActivitiesSubTitle>
          </>
        )}
      </View>
    </SignedInLayout>
  )
}
