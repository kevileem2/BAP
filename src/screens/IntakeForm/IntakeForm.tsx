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
import { IntakeForms } from '../../utils/storage'
import {
  ListContainer,
  NoIntakeFormInfo,
  NoIntakeFormInfoSubTitle,
} from './components'
import ListCard from './ListCard'
import useRealm from '../../utils/useRealm'
import IntakeFormModal from './IntakeFormModal'
import { Metrics } from '../../themes'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal, hideModal } = useModal()
  const [loading, setLoading] = useState<boolean>(true)
  const [intakeForms, setIntakeForms] = useState<Results<IntakeForms> | null>(
    null
  )

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
    const realmIntakeForms = realm
      ?.objects<IntakeForms>('IntakeForms')
      .filtered('changeType != 0')
    if (realmIntakeForms?.length) {
      setIntakeForms(realmIntakeForms)
    }
  }

  useEffect(() => {
    if (realm) {
      const realmIntakeForms = realm
        ?.objects<IntakeForms>('IntakeForms')
        .filtered('changeType != 0')
      if (realmIntakeForms?.length) {
        setIntakeForms(realmIntakeForms)
      }
    }
  }, [realm, navigation])

  useEffect(() => {
    setLoading(false)
  }, [])

  // key extractor for the Flatlist, keyExtractor tells the list to use the ids for the react keys instead of the default key property.
  const getKeyExtractor = (item, index) => index.toString()

  // renders each contact with props
  const renderIntakeForm = ({ item, index }) => (
    <ListCard key={`contact-list-card-${item.id}`} {...item} />
  )

  // use callback for rendering the contacts
  const renderItemCall = useCallback(
    ({ item, index }) => renderIntakeForm({ item, index }),
    [intakeForms]
  )

  // use memo for mapping the contacts
  const mapIntakeFormData = useMemo(
    () =>
      intakeForms &&
      intakeForms.sorted('title').map((item) => ({
        guid: item.guid,
        title: item.title,
        changeType: item.changeType,
      })),
    [intakeForms]
  )

  const handleHeaderIconAction = () => {
    navigation.navigate('Clients')
  }

  const handleModalVisibilityChange = () => {
    showModal(
      <IntakeFormModal
        hideModal={hideModal}
        navigation={navigation}
        titleCaption={formatMessage('title', realm)}
        continueCaption={formatMessage('continue', realm)}
        titleMandatoryCaption={formatMessage('titleMandatory', realm)}
        write={write}
      />
    )
  }

  return (
    <SignedInLayout
      headerTitle={formatMessage('intakeForms', realm)}
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      showAddIcon
      handleAddPress={handleModalVisibilityChange}
      hideFooter>
      <View style={{ flex: 1, padding: Metrics.baseMargin }}>
        {loading ? null : intakeForms?.length ? (
          <ListContainer
            keyboardShouldPersistTaps="handled"
            data={mapIntakeFormData}
            renderItem={renderItemCall}
            keyExtractor={getKeyExtractor}
            extraData={{ intakeForms }}
          />
        ) : (
          <>
            <NoIntakeFormInfo>
              {formatMessage('noIntakeFormYet', realm)}
            </NoIntakeFormInfo>
            <NoIntakeFormInfoSubTitle>
              {formatMessage('noIntakeFormYetSubTitle', realm)}
            </NoIntakeFormInfoSubTitle>
          </>
        )}
      </View>
    </SignedInLayout>
  )
}
