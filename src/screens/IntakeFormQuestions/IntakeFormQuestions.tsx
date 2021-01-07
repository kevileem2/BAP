import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { Results } from 'realm'
import { useNavigation } from '@react-navigation/native'
import { useModal } from '../../utils/ModalProvider'
import { RealmContext } from '../../App'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import { IntakeFormQuestions } from '../../utils/storage'
import {
  ListContainer,
  NoIntakeFormInfo,
  NoIntakeFormInfoSubTitle,
} from './components'
import ListCard from './ListCard'
import { Colors, Metrics } from '../../themes'
import useRealm from '../../utils/useRealm'
import IntakeFormQuestionsModal from './IntakeFormQuestionsModal'

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { parentRecordGuid } = route?.params
  const { showModal, hideModal } = useModal()
  const [loading, setLoading] = useState<boolean>(true)
  const [questions, setQuestions] = useState<Results<
    IntakeFormQuestions
  > | null>(null)

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
    const realmQuestions = realm
      ?.objects<IntakeFormQuestions>('IntakeFormQuestions')
      .filtered(`changeType != 0 AND parentRecordGuid = "${parentRecordGuid}"`)
    if (realmQuestions?.length) {
      setQuestions(realmQuestions)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmQuestions = realm
        ?.objects<IntakeFormQuestions>('IntakeFormQuestions')
        .filtered(
          `changeType != 0 AND parentRecordGuid = "${parentRecordGuid}"`
        )
      if (realmQuestions?.length) {
        setQuestions(realmQuestions)
      }
    }
  }, [realm, navigation])

  useEffect(() => {
    setLoading(false)
  }, [])

  // key extractor for the Flatlist, keyExtractor tells the list to use the ids for the react keys instead of the default key property.
  const getKeyExtractor = (item, index) => index.toString()

  // renders each question with props
  const renderContacts = ({ item, index }) => (
    <ListCard key={`question-list-card-${item.guid}`} {...item} />
  )

  // use callback for rendering the contacts
  const renderItemCall = useCallback(
    ({ item, index }) => renderContacts({ item, index }),
    [questions]
  )

  // use memo for mapping the questions
  const mapQuestions = useMemo(
    () =>
      questions &&
      questions.sorted('sort').map((item) => ({
        guid: item.guid,
        question: item.question,
        changeType: item.changeType,
      })),
    [questions]
  )

  const handleHeaderIconAction = () => {
    navigation.navigate('IntakeForm')
  }

  const handleModalVisibilityChange = () => {
    showModal(
      <IntakeFormQuestionsModal
        parentRecordGuid={parentRecordGuid}
        hideModal={hideModal}
        realm={realm}
        write={write}
        index={questions?.length ?? 0}
      />
    )
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('questions', realm)}
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      showAddIcon
      handleAddPress={handleModalVisibilityChange}
      hideFooter>
      <View style={{ flex: 1, padding: Metrics.baseMargin }}>
        {loading ? null : questions?.length ? (
          <ListContainer
            keyboardShouldPersistTaps="handled"
            data={mapQuestions}
            renderItem={renderItemCall}
            keyExtractor={getKeyExtractor}
            extraData={{ questions }}
          />
        ) : (
          <>
            <NoIntakeFormInfo>
              {formatMessage('noIntakeFormQuestionsYet', realm)}
            </NoIntakeFormInfo>
            <NoIntakeFormInfoSubTitle>
              {formatMessage('noIntakeFormQuestionsYetSubTitle', realm)}
            </NoIntakeFormInfoSubTitle>
          </>
        )}
      </View>
    </SignedInLayout>
  )
}
