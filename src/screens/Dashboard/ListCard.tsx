import React, { useState, useEffect } from 'react'
import { TouchableWithoutFeedback, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useRealm from 'utils/useRealm'
import { Results } from 'realm'
import { AvatarInitials } from '../../shared'
import {
  ContactRow,
  Name,
  ContactInfoContainer,
  IconContainer,
  Icon,
} from './components'
import { Clients } from '../../utils/storage'
import { format } from 'date-fns'
import { Colors } from '../../themes'

interface Props {
  id?: number
  guid: string
  message?: string | null
  updatedAt?: Date | null
  parentGuid?: string | null
  changeType?: number | null
}

export default ({
  message,
  updatedAt,
  guid,
  activityGuid,
  parentGuid,
  changeType,
}: Props) => {
  const navigation = useNavigation()
  const [name, setName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  const {
    objects: { client },
  } = useRealm<{
    client: Results<Clients>
  }>([{ object: 'Clients', name: 'client', query: `guid == "${parentGuid}"` }])

  useEffect(() => {
    if (client) {
      client[0]?.name && setName(client[0].name)
      client[0]?.lastName && setLastName(client[0].lastName)
    }
  }, [client])

  const handleNotePress = () => {
    navigation.navigate('TextInput', {
      guid,
      parentGuid,
      activityGuid,
      message,
      changeType,
    })
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={handleNotePress}>
        <ContactRow>
          <AvatarInitials firstName={name} lastName={lastName} size={28} />
          <ContactInfoContainer>
            <Name numberOfLines={1}>{`${message}`}</Name>
            {updatedAt && (
              <Text style={{ color: Colors.secondaryText }}>{`${format(
                updatedAt,
                'dd/MM/yyyy'
              )} - ${format(
                new Date(
                  updatedAt.getTime() + new Date().getTimezoneOffset() * 60000
                ),
                'HH:mm'
              )}`}</Text>
            )}
          </ContactInfoContainer>
          <IconContainer>
            <Icon size={24} name="chevron-right" />
          </IconContainer>
        </ContactRow>
      </TouchableWithoutFeedback>
    </>
  )
}
