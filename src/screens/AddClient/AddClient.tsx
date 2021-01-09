import React, { useState, useEffect, useContext, useMemo } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { Results } from 'realm'
import { RealmContext } from '../../App'
import { useNavigation } from '@react-navigation/native'
import { Guid } from 'guid-typescript'
import SignedInLayout from '../../shared/SignedInStack'
import useRealm from '../../utils/useRealm'
import {
  Clients,
  IntakeForms,
  IntakeFormQuestions,
  ClientIntakeFormQuestions,
} from '../../utils/storage'
import { Metrics, Colors } from '../../themes'
import { formatMessage, Picker } from '../../shared'
import PickerItem from '../../shared/Picker/PickerItem'
import {
  Button,
  Icon,
  StyledTextInput,
  InputHeaderContainer,
  InputHeaderText,
  Header,
  HeaderText,
  InfoContainer,
  Row,
  Name,
  IconContainer,
} from './components'

interface Errors {
  firstName?: boolean
  lastName?: boolean
}

export default ({ route }) => {
  const userGuid = route.params?.userGuid
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const [modalVisibility, changeModalVisibility] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [intakeForms, setIntakeForms] = useState<Results<IntakeForms> | null>(
    null
  )
  const [intakeForm, setIntakeForm] = useState<{ guid: string; title: string }>(
    { guid: 'none', title: formatMessage('none', realm) }
  )
  const [intakeFormQuestions, setIntakeFormQuestions] = useState<Results<
    IntakeFormQuestions
  > | null>(null)
  const [questions, setQuestions] = useState<{}>({})
  const [errors, setErrors] = useState<Errors>({})

  const {
    objects: { clients },
    write,
  } = useRealm<{
    clients: Results<Clients>
  }>([
    {
      object: 'Clients',
      name: 'clients',
      query: `changeType != "0" AND guid == "${userGuid}"`,
    },
  ])

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
      if (userGuid) {
        const realmClient = realm
          ?.objects<Clients>('Clients')
          .filtered(`changeType != 0 AND guid == "${userGuid}"`)?.[0]
        if (realmClient) {
          setFirstName(realmClient.name)
          setLastName(realmClient.lastName)
        }
      }
    }
  }, [realm, navigation])

  useEffect(() => {
    if (intakeForm.guid !== 'none') {
      const realmQuestions = realm
        ?.objects<IntakeFormQuestions>('IntakeFormQuestions')
        .filtered(
          `changeType != 0 AND parentRecordGuid == "${intakeForm.guid}"`
        )
      if (realmQuestions?.length) {
        setIntakeFormQuestions(realmQuestions)
      }
    } else {
      setIntakeFormQuestions(null)
    }
  }, [intakeForm])

  const handleHeaderIconAction = () => {
    navigation.goBack()
  }

  const handleFirstName = (text: string) => {
    setFirstName(text)
  }
  const handleLastName = (text: string) => {
    setLastName(text)
  }

  const handleAddClientPress = async () => {
    if (firstName && lastName) {
      const clientGuid = String(Guid.create()).toUpperCase()
      if (userGuid) {
        const realmClient = realm
          ?.objects<Clients>('Clients')
          .filtered(`changeType != 0 AND guid == "${userGuid}"`)?.[0]
        write((realmInstance: Realm) => {
          realmInstance.create(
            'Clients',
            {
              guid: userGuid,
              changeType: realmClient?.changeType !== 1 ? 2 : 1,
              name: firstName,
              lastName,
            },
            Realm.UpdateMode.All
          )
        })
      } else {
        write((realmInstance: Realm) => {
          realmInstance.create(
            'Clients',
            {
              guid: clientGuid,
              changeType: 1,
              name: firstName,
              lastName,
            },
            Realm.UpdateMode.All
          )
        })
      }
      if (questions && Object.keys(questions)?.length) {
        write((realmInstance: Realm) => {
          Object.values(questions).forEach((question) => {
            realmInstance.create(
              'ClientIntakeFormQuestions',
              {
                guid: String(Guid.create()).toUpperCase(),
                parentRecordGuid: clientGuid,
                parentIntakeFormGuid: intakeForm.guid,
                question: question.question,
                answer: question.answer,
                sort: question.sort,
                changeType: 1,
              },
              Realm.UpdateMode.All
            )
          })
        })
      }
      navigation.navigate('Clients')
    } else {
      setErrors({
        firstName: !Boolean(firstName?.length),
        lastName: !Boolean(lastName?.length),
      })
    }
  }

  const handleQuestionChange = (
    guid: string,
    question: string,
    sort: number
  ) => (value: string) => {
    setQuestions((prevState) => ({
      ...prevState,
      [guid]: {
        question,
        answer: value,
        sort,
      },
    }))
  }

  const renderQuestion = (item: {
    guid: string
    question: string | null
    sort: number
  }) =>
    item.question ? (
      <>
        <InputHeaderContainer key={`header-${item.guid}`}>
          <InputHeaderText key={`headerText-${item.guid}`}>
            {item.question}
          </InputHeaderText>
        </InputHeaderContainer>
        <StyledTextInput
          style={{ height: 100, paddingTop: Metrics.baseMargin }}
          key={`input-${item.guid}`}
          value={questions[item.guid] || ''}
          textAlignVertical="top"
          autoCapitalize="sentences"
          selectionColor={Colors.primaryText}
          onChangeText={handleQuestionChange(
            item.guid,
            item.question,
            item.sort
          )}
          returnKeyType="next"
          textContentType="givenName"
          multiline={true}
        />
      </>
    ) : null

  const mapAllQuestions = useMemo(() => {
    if (intakeFormQuestions) {
      let mappedIntakeFormQuestions = intakeFormQuestions
        ?.sorted('sort')
        .map((el) => ({
          guid: el.guid,
          question: el.question,
          sort: el.sort,
        }))
      mappedIntakeFormQuestions = [
        ...mappedIntakeFormQuestions,
        {
          guid: 'additionalComments',
          question: formatMessage('additionalComments', realm),
          sort: mappedIntakeFormQuestions.length,
        },
      ]
      return mappedIntakeFormQuestions?.map(renderQuestion)
    }
    return []
  }, [intakeFormQuestions, questions])

  const handleValueChange = (value: string | null) => {
    const getIntakeForm = intakeForms?.find((el) => el.guid === value)
    if (value && value !== 'none' && getIntakeForm?.title) {
      setIntakeForm({ guid: value, title: getIntakeForm.title })
    } else {
      setIntakeForm({ guid: 'none', title: formatMessage('none', realm) })
    }
    setQuestions({})
    handleModalVisibilityChange()
  }

  const handleModalVisibilityChange = () => {
    changeModalVisibility((prevState) => !prevState)
  }

  const handleValuePress = (value: string | null) => () => {
    handleValueChange(value)
  }

  const renderPickerItem = (
    item: { guid: string | null; title: string | null },
    index: number
  ) => (
    <PickerItem
      key={item.guid || 'none'}
      platform={Platform.OS}
      label={item.title || ''}
      value={item.guid}
      onPress={handleValuePress}
      index={index}
    />
  )

  const options = useMemo(() => {
    if (intakeForms) {
      let mappedIntakeForms = intakeForms.sorted('title').map((item) => ({
        guid: item.guid,
        title: item.title,
      }))
      mappedIntakeForms = [
        { guid: 'none', title: formatMessage('none', realm) },
        ...mappedIntakeForms,
      ]
      return mappedIntakeForms.map(renderPickerItem)
    }
    return []
  }, [intakeForms])

  return (
    <>
      <SignedInLayout
        headerTitle={
          userGuid
            ? formatMessage('updateClient', realm)
            : formatMessage('addClient', realm)
        }
        headerIcon="arrow-left"
        headerIconAction={handleHeaderIconAction}
        hideFooter>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            paddingBottom: Metrics.smallMargin,
            overflow: 'visible',
          }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: Metrics.largeMargin }}>
            <InputHeaderContainer>
              <InputHeaderText>{`${formatMessage('firstName', realm)
                .charAt(0)
                .toUpperCase()}${formatMessage('firstName', realm).slice(
                1
              )}`}</InputHeaderText>
            </InputHeaderContainer>
            <StyledTextInput
              value={firstName}
              autoCapitalize="words"
              selectionColor={Colors.primaryText}
              onChangeText={handleFirstName}
              returnKeyType="next"
              textContentType="givenName"
            />
            {errors.firstName && (
              <Text
                style={{
                  color: Colors.errorDark,
                  paddingBottom: Metrics.baseMargin,
                  marginLeft: Metrics.smallMargin,
                }}>
                * {formatMessage('firstNameIsMandatory', realm)}
              </Text>
            )}
            <InputHeaderContainer>
              <InputHeaderText>{`${formatMessage('lastName', realm)
                .charAt(0)
                .toUpperCase()}${formatMessage('lastName', realm).slice(
                1
              )}`}</InputHeaderText>
            </InputHeaderContainer>
            <StyledTextInput
              value={lastName}
              autoCapitalize="words"
              selectionColor={Colors.primaryText}
              onChangeText={handleLastName}
              returnKeyType="go"
              textContentType="familyName"
            />
            {errors.lastName && (
              <Text
                style={{
                  color: Colors.errorDark,
                  paddingBottom: Metrics.baseMargin,
                  marginLeft: Metrics.smallMargin,
                }}>
                * {formatMessage('lastNameIsMandatory', realm)}
              </Text>
            )}
            {!userGuid && (
              <>
                <Header>
                  <HeaderText>
                    {formatMessage('intakeForm', realm).toUpperCase()}
                  </HeaderText>
                </Header>
                <TouchableWithoutFeedback onPress={handleModalVisibilityChange}>
                  <Row>
                    <InfoContainer>
                      <Name>{intakeForm.title}</Name>
                    </InfoContainer>
                    <IconContainer>
                      <Icon
                        style={{ color: Colors.primaryText }}
                        size={24}
                        name="chevron-down"
                      />
                    </IconContainer>
                  </Row>
                </TouchableWithoutFeedback>
                {intakeFormQuestions && mapAllQuestions}
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: Metrics.baseMargin,
              }}>
              <TouchableOpacity onPress={handleAddClientPress}>
                <Button
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
                  <Text
                    style={{
                      color: Colors.primaryTextLight,
                      fontWeight: '500',
                    }}>
                    {formatMessage(
                      userGuid ? 'updateClient' : 'addClient',
                      realm
                    ).toUpperCase()}
                  </Text>
                  <Icon
                    name="plus"
                    size={24}
                    style={{
                      marginLeft: Metrics.baseMargin,
                      color: Colors.primaryTextLight,
                    }}
                  />
                </Button>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SignedInLayout>
      <Picker
        visible={modalVisibility}
        selectedValue={intakeForm.guid || ''}
        options={options}
        onValueChange={handleValueChange}
        onDismiss={handleModalVisibilityChange}
      />
    </>
  )
}
