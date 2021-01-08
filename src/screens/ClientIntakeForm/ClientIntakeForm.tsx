import React, { useState, useEffect, useMemo, useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Results } from 'realm'
import SignedInLayout from '../../shared/SignedInStack'
import { ClientIntakeFormQuestions } from '../../utils/storage'
import { Metrics, Colors } from '../../themes'
import { RealmContext } from '../../App'
import {
  Answer,
  Header,
  HeaderText,
  NoQuestions,
  NoQuestionsSubTitle,
} from './components'
import { formatMessage } from '../../shared'

export default ({ route }) => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { parent } = route.params
  const [questions, setQuestions] = useState<Results<
    ClientIntakeFormQuestions
  > | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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
        .objects<ClientIntakeFormQuestions>('ClientIntakeFormQuestions')
        .filtered(`changeType != 0 AND parentRecordGuid == "${parent.guid}"`)
      setQuestions(clientQuestions)
    }
  }

  useEffect(() => {
    if (realm) {
      const clientQuestions = realm
        .objects<ClientIntakeFormQuestions>('ClientIntakeFormQuestions')
        .filtered(`changeType != 0 AND parentRecordGuid == "${parent.guid}"`)
      setQuestions(clientQuestions)
    }
  }, [realm, navigation])

  // renders each question
  const renderQuestions = (item: ClientIntakeFormQuestions, index: number) => {
    if (item.answer) {
      return (
        <>
          <Header isFirst={!index} key={`header-${item.guid}`}>
            <HeaderText key={`headerText-${item.guid}`}>
              {item.question?.toUpperCase()}
            </HeaderText>
          </Header>
          <Answer key={`answer-${item.guid}`}>{item.answer}</Answer>
        </>
      )
    }
    return null
  }

  const mapQuestions = useMemo(
    () => questions && questions.sorted('sort')?.map(renderQuestions),
    [questions]
  )

  return (
    <SignedInLayout
      headerTitle={`${parent?.name} ${parent?.lastName}`}
      headerIcon="arrow-left"
      hideFooter>
      {loading ? null : questions?.length ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            padding: Metrics.baseMargin,
            marginTop: Metrics.largeMargin,
          }}
          keyboardShouldPersistTaps="handled">
          {mapQuestions && mapQuestions}
        </ScrollView>
      ) : (
        <View style={{ padding: Metrics.baseMargin }}>
          <NoQuestions>
            {formatMessage('noClientIntakeForm', realm)}
          </NoQuestions>
        </View>
      )}
    </SignedInLayout>
  )
}
