import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import DatePicker from 'react-native-date-picker'
import CheckBox from '@react-native-community/checkbox'
import { format } from 'date-fns'
import { formatMessage } from '../../shared'
import { RealmContext } from '../../App'
import SignedInLayout from '../../shared/SignedInStack'
import { Colors, Metrics } from '../../themes'
import { useModal } from '../../utils/ModalProvider'
import useRealm from '../../utils/useRealm'
import { Header, HeaderText, Icon, StyledTextInput, Button } from './components'
import { Guid } from 'guid-typescript'
// import { Tasks } from 'utils/storage'
// import { Results } from 'realm'

export default () => {
  const navigation = useNavigation()
  const realm = useContext(RealmContext)
  const { showModal } = useModal()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [date, setDate] = useState(new Date())
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

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

  const handleDatePicker = () => {
    showModal(
      <View
        style={{
          backgroundColor: Colors.primaryTextLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: Metrics.largeMargin,
          marginRight: Metrics.largeMargin,
          borderRadius: 25,
        }}>
        <DatePicker date={date} onDateChange={setDate} mode="date" />
      </View>
    )
  }

  const handleAddTaskPress = () => {
    const newDate = new Date()
    write((realmInstance: Realm) => {
      realmInstance.create(
        'Tasks',
        {
          guid: String(Guid.create()).toUpperCase(),
          title,
          description,
          completed: toggleCheckBox,
          dueTime: date,
          createdAt: newDate,
          updatedAt: newDate,
          completedAt: toggleCheckBox ? newDate : null,
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
        contentContainerStyle={{
          paddingBottom: Metrics.baseMargin,
        }}
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
          textAlignVertical="top"
          value={description}
          autoCapitalize="sentences"
          selectionColor={Colors.primaryText}
          onChangeText={handleDescription}
          returnKeyType="next"
          multiline={true}
        />
        <Header>
          <HeaderText>{`${formatMessage('dueDate', realm)
            .charAt(0)
            .toUpperCase()}${formatMessage('dueDate', realm).slice(
            1
          )}`}</HeaderText>
        </Header>
        <TouchableOpacity onPress={handleDatePicker}>
          <View pointerEvents="none">
            <StyledTextInput
              value={format(date, 'dd-MM-yyyy')}
              selectionColor={Colors.primaryText}
              onChangeText={handleDescription}
              returnKeyType="go"
              editable={false}
            />
          </View>
        </TouchableOpacity>
        <Header
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HeaderText>{`${formatMessage('completed', realm)
            .charAt(0)
            .toUpperCase()}${formatMessage('completed', realm).slice(
            1
          )}`}</HeaderText>
        </Header>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: Metrics.smallMargin,
          }}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
            onCheckColor={Colors.primary}
            onTintColor={Colors.primary}
            onFillColor={Colors.primaryTextLight}
            lineWidth={1}
            tintColors={{ true: Colors.primary }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: Metrics.doubleLargeMargin,
          }}>
          <TouchableOpacity onPress={handleAddTaskPress}>
            <Button
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[Colors.buttonColorLight, Colors.buttonColorDark]}>
              <Text
                style={{
                  color: Colors.primaryTextLight,
                  fontWeight: '500',
                }}>
                {formatMessage('addTask', realm).toUpperCase()}
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
    </SignedInLayout>
  )
}
