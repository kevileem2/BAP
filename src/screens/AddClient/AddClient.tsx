import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Guid } from 'guid-typescript'
import SignedInLayout from '../../shared/SignedInStack'
import useRealm from '../../utils/useRealm'
import { User, Clients } from '../../utils/storage'
import { Metrics, Colors } from '../../themes'
import { formatMessage } from '../../shared'
import {
  InputContainer,
  Button,
  Icon,
  IconHeader,
  IconHeaderContainer,
  Container,
  IconHeaderContainerWrapper,
} from './components'
import { Results } from 'realm'

interface Errors {
  firstName?: boolean
  lastName?: boolean
}

export default ({ route }) => {
  const navigation = useNavigation()
  const userGuid = route.params?.userGuid
  const [firstName, setFirstName] = useState<string | undefined>(undefined)
  const [lastName, setLastName] = useState<string | undefined>(undefined)
  const [age, setAge] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)
  const [room, setRoom] = useState<string | undefined>(undefined)
  const [changeType, setChangeType] = useState<number | undefined>(undefined)
  const [errors, setErrors] = useState<Errors>({})

  const {
    objects: { user, clients },
    write,
  } = useRealm<{
    user: Results<User>
    clients: Results<Clients>
  }>([
    { object: 'User', name: 'user' },
    {
      object: 'Clients',
      name: 'clients',
      query: `changeType != "0" AND guid == "${userGuid}"`,
    },
  ])

  useEffect(() => {
    if (userGuid && clients?.[0]) {
      clients[0].name && setFirstName(clients[0].name)
      clients[0].lastName && setLastName(clients[0].lastName)
      clients[0].age && setAge(clients[0].age.toString())
      clients[0].room && setRoom(clients[0].room.toString())
      clients[0].description && setDescription(clients[0].description)
      clients[0].changeType && setChangeType(clients[0].changeType)
    }
  }, [clients])

  const handleHeaderIconAction = () => {
    navigation.goBack()
  }

  const handleFirstName = (text: string) => {
    setFirstName(text)
  }
  const handleLastName = (text: string) => {
    setLastName(text)
  }
  const handleAge = (text: string) => {
    setAge(text)
  }
  const handleDescription = (text: string) => {
    setDescription(text)
  }
  const handleRoom = (text: string) => {
    setRoom(text)
  }

  const handleAddClientPress = async () => {
    if (firstName && lastName) {
      if (userGuid) {
        write((realmInstance: Realm) => {
          realmInstance.create(
            'Clients',
            {
              guid: userGuid,
              changeType: changeType !== 1 ? 2 : 1,
              name: firstName,
              lastName,
              age: age && parseInt(age),
              room: room && parseInt(room),
              description,
            },
            true
          )
        })
      } else {
        write((realmInstance: Realm) => {
          realmInstance.create('Clients', {
            guid: String(Guid.create()).toUpperCase(),
            parentRecordGuid: user?.[0].guid,
            changeType: 1,
            name: firstName,
            lastName,
            age: age && parseInt(age),
            room: room && parseInt(room),
            description,
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

  return (
    <SignedInLayout
      headerTitle={formatMessage('addClient')}
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      hideFooter>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingBottom: Metrics.smallMargin,
          overflow: 'visible',
        }}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          contentContainerStyle={{ padding: Metrics.largeMargin }}>
          <Container>
            <IconHeaderContainerWrapper>
              <IconHeaderContainer
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[
                  Colors.accentButtonColorLight,
                  Colors.accentButtonColorDark,
                ]}>
                <IconHeader name="account" size={32} />
              </IconHeaderContainer>
            </IconHeaderContainerWrapper>
            <InputContainer>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={formatMessage('firstName')}
                  placeholderTextColor={Colors.secondaryText}
                  value={firstName}
                  autoCapitalize="words"
                  selectionColor={Colors.primary}
                  onChangeText={handleFirstName}
                  returnKeyType="next"
                  textContentType="givenName"
                  style={{
                    height: 24,
                    width: '100%',
                    marginLeft: Metrics.smallMargin,
                    fontSize: 14,
                    fontWeight: '300',
                  }}
                />
              </View>
            </InputContainer>
            {errors.firstName && (
              <Text
                style={{
                  color: Colors.errorDark,
                  marginTop: Metrics.baseMargin,
                }}>
                * {formatMessage('firstNameIsMandatory')}
              </Text>
            )}
            <InputContainer>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={formatMessage('lastName')}
                  placeholderTextColor={Colors.secondaryText}
                  value={lastName}
                  autoCapitalize="words"
                  selectionColor={Colors.primary}
                  onChangeText={handleLastName}
                  returnKeyType="next"
                  textContentType="familyName"
                  style={{
                    height: 24,
                    width: '100%',
                    marginLeft: Metrics.smallMargin,
                    fontSize: 14,
                    fontWeight: '300',
                  }}
                />
              </View>
            </InputContainer>
            {errors.lastName && (
              <Text
                style={{
                  color: Colors.errorDark,
                  marginTop: Metrics.baseMargin,
                }}>
                * {formatMessage('lastNameIsMandatory')}
              </Text>
            )}
            <InputContainer>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={formatMessage('age')}
                  placeholderTextColor={Colors.secondaryText}
                  value={age}
                  selectionColor={Colors.primary}
                  onChangeText={handleAge}
                  returnKeyType="next"
                  keyboardType="numeric"
                  style={{
                    height: 24,
                    width: '100%',
                    marginLeft: Metrics.smallMargin,
                    fontSize: 14,
                    fontWeight: '300',
                  }}
                />
              </View>
            </InputContainer>
            <InputContainer>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={formatMessage('room')}
                  placeholderTextColor={Colors.secondaryText}
                  value={room}
                  selectionColor={Colors.primary}
                  onChangeText={handleRoom}
                  returnKeyType="next"
                  keyboardType="numeric"
                  style={{
                    height: 24,
                    width: '100%',
                    marginLeft: Metrics.smallMargin,
                    fontSize: 14,
                    fontWeight: '300',
                  }}
                />
              </View>
            </InputContainer>
            <InputContainer>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={formatMessage('description')}
                  placeholderTextColor={Colors.secondaryText}
                  value={description}
                  autoCapitalize="sentences"
                  selectionColor={Colors.primary}
                  onChangeText={handleDescription}
                  returnKeyType="go"
                  style={{
                    height: 24,
                    width: '100%',
                    marginLeft: Metrics.smallMargin,
                    fontSize: 14,
                    fontWeight: '300',
                  }}
                />
              </View>
            </InputContainer>
          </Container>
          <TouchableOpacity onPress={handleAddClientPress}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: Metrics.baseMargin,
              }}>
              <Button
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
                <Text
                  style={{
                    color: Colors.primaryTextLight,
                    fontWeight: '500',
                  }}>
                  {formatMessage('addClient').toUpperCase()}
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
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SignedInLayout>
  )
}
