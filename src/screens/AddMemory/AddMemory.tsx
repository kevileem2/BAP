import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { formatMessage } from '../../shared'
import { RealmContext } from '../../App'
import SignedInLayout from '../../shared/SignedInStack'
import { Colors, Metrics } from '../../themes'
import useRealm from '../../utils/useRealm'
import { Header, HeaderText, Icon, StyledTextInput, Button } from './components'
import { Guid } from 'guid-typescript'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const { write } = useRealm<{}>([])

  const handleHeaderIconAction = () => {
    navigation.navigate('Profile')
  }

  const handleTitle = (text: string) => {
    setTitle(text)
  }
  const handleDescription = (text: string) => {
    setDescription(text)
  }

  const handleAddMemoryPress = () => {
    write((realmInstance: Realm) => {
      realmInstance.create(
        'Memories',
        {
          guid: String(Guid.create()).toUpperCase(),
          title,
          description,
          changeType: 1,
        },
        Realm.UpdateMode.All
      )
    })
    navigation.navigate('Profile')
  }

  return (
    <SignedInLayout
      headerIcon="arrow-left"
      headerIconAction={handleHeaderIconAction}
      headerTitle={formatMessage('addTask', realm)}
      hideFooter>
      <ScrollView
        style={{ flex: 1, padding: Metrics.largeMargin }}
        keyboardShouldPersistTaps="handled">
        <Header>
          <HeaderText>{`${formatMessage('title', realm)
            .charAt(0)
            .toUpperCase()}${formatMessage('title', realm).slice(
            1
          )}`}</HeaderText>
        </Header>
        <StyledTextInput
          value={title}
          autoCapitalize="sentences"
          selectionColor={Colors.primaryText}
          onChangeText={handleTitle}
          returnKeyType="next"
        />
        <Header>
          <HeaderText>{`${formatMessage('description', realm)
            .charAt(0)
            .toUpperCase()}${formatMessage('description', realm).slice(
            1
          )}`}</HeaderText>
        </Header>
        <StyledTextInput
          style={{ height: 100, paddingTop: Metrics.baseMargin }}
          textAlignVertical="center"
          value={description}
          autoCapitalize="sentences"
          selectionColor={Colors.primaryText}
          onChangeText={handleDescription}
          returnKeyType="next"
          multiline={true}
        />
        <TouchableOpacity onPress={handleAddMemoryPress}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: Metrics.doubleLargeMargin,
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
                {formatMessage('addMemory', realm).toUpperCase()}
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
    </SignedInLayout>
  )
}
