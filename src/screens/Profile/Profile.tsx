import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SignedInLayout from '../../shared/SignedInStack'
import { formatMessage } from '../../shared'
import { RealmContext } from '../../App'
import { Metrics } from '../../themes'
import { Header, Icon, Section } from './components'
import { Overview } from './Overview'
import { Tasks } from './Tasks'
import { Memory } from './Memory'

export default () => {
  const navigation = useNavigation()
  const [isSynchronizing, setIsSynchronize] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<number>(0)

  const realm = useContext(RealmContext)

  const handleSynchronizePress = () => {
    setIsSynchronize(true)
    setTimeout(() => setIsSynchronize(false), 1000)
  }

  const handleLeftFlingGesture = () => {
    navigation.navigate('Settings')
  }

  const handleRightFlingGesture = () => {
    navigation.navigate('Clients')
  }

  const getIconName = (type: 'overview' | 'tasks' | 'memory') => {
    switch (type) {
      case 'overview':
        return activeTab === 0 ? 'calendar-account' : 'calendar-account-outline'
      case 'tasks':
        return activeTab === 1 ? 'clipboard-check' : 'clipboard-check-outline'
      case 'memory':
        return activeTab === 2 ? 'head-check' : 'head-check-outline'
    }
  }

  const getHeaderTitle = () => {
    let messageTitle
    switch (activeTab) {
      case 0:
        messageTitle = formatMessage('overview', realm)
        return `${messageTitle.charAt(0).toUpperCase()}${messageTitle.slice(1)}`
      case 1:
        messageTitle = formatMessage('tasks', realm)
        return `${messageTitle.charAt(0).toUpperCase()}${messageTitle.slice(1)}`
      case 2:
        messageTitle = formatMessage('remember', realm)
        return `${messageTitle.charAt(0).toUpperCase()}${messageTitle.slice(1)}`
    }
  }

  const changeActiveTabIndex = (index: number) => () => {
    setActiveTab(index)
  }

  const handleAddTaskPress = () => {
    navigation.navigate('AddTask')
  }

  const handleAddMemoryPress = () => {
    navigation.navigate('AddMemory')
  }

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return <Overview />
      case 1:
        return <Tasks />
      case 2:
        return <Memory />
    }
  }

  return (
    <SignedInLayout
      headerTitle={getHeaderTitle()}
      showSynchronizeIcon
      isSynchronizing={isSynchronizing}
      showAddTask={activeTab === 1}
      showAddMemory={activeTab === 2}
      handleAddMemoryPress={handleAddMemoryPress}
      handleAddTaskPress={handleAddTaskPress}
      handleSynchronizePress={handleSynchronizePress}
      onLeftFlingGesture={handleLeftFlingGesture}
      onRightFlingGesture={handleRightFlingGesture}
      activeTabIndex={2}>
      <Header>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={changeActiveTabIndex(0)}>
          <Section isFirst isActive={activeTab === 0}>
            <Icon size={20} name={getIconName('overview')} />
          </Section>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={changeActiveTabIndex(1)}>
          <Section isActive={activeTab === 1}>
            <Icon size={20} name={getIconName('tasks')} />
          </Section>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={changeActiveTabIndex(2)}>
          <Section isLast isActive={activeTab === 2}>
            <Icon
              isActive={activeTab === 2}
              size={20}
              name={getIconName('memory')}
            />
          </Section>
        </TouchableWithoutFeedback>
      </Header>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Metrics.baseMargin,
        }}
        style={{ flex: 1, padding: Metrics.largeMargin }}>
        {renderTab()}
      </ScrollView>
    </SignedInLayout>
  )
}
