import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, View, StatusBar } from 'react-native'
import { IconButton } from 'react-native-paper'
import {
  FlingGestureHandler,
  State as GestureState,
  Directions,
} from 'react-native-gesture-handler'
import { ScreenHeader, RotatingIcon } from '../'
import { Colors } from '../../themes'
import { ActionsContainer, IconContainer } from './components'
import Footer from '../Footer'

const LayoutContainerView = Platform.OS === 'ios' ? KeyboardAvoidingView : View

interface Props {
  headerIcon?: 'arrow-left'
  headerTitle: string
  hideFooter?: boolean
  supressNavigation?: boolean
  showSearch?: boolean
  showSettings?: boolean
  showSynchronizeIcon?: boolean
  showFilters?: boolean
  showNotifications?: boolean
  showDashboard?: boolean
  showEmail?: boolean
  showInformation?: boolean
  showAddIcon?: boolean
  showEdit?: boolean
  showDelete?: boolean
  notificationCount?: number
  activeItem?: number
  activeTabIndex?: number
  isSynchronizing?: boolean
  nextAction?: () => void
  backAction?: () => void
  headerNextIconAction?: () => void
  headerIconAction?: () => void
  handleSearchPress?: () => void
  handleSettingsPress?: () => void
  handleInformationPress?: () => void
  handleSynchronizePress?: () => void
  handleAddPress?: () => void
  handleEditPress?: () => void
  handleDeletePress?: () => void
  onLeftFlingGesture?: () => void
  onRightFlingGesture?: () => void
}

const SignedInLayout: React.FC<Props> = ({
  headerIcon,
  headerTitle,
  hideFooter,
  children,
  supressNavigation,
  showSearch,
  showSettings,
  showSynchronizeIcon,
  showAddIcon,
  showInformation,
  showEdit,
  showDelete,
  activeTabIndex,
  isSynchronizing,
  headerNextIconAction,
  headerIconAction,
  handleSearchPress,
  handleSettingsPress,
  handleInformationPress,
  handleSynchronizePress,
  handleAddPress,
  handleEditPress,
  handleDeletePress,
  onLeftFlingGesture,
  onRightFlingGesture,
}) => {
  const handleLeftFlingStateChange = (event) => {
    if (!supressNavigation) {
      const { oldState } = event.nativeEvent
      if (oldState === GestureState.ACTIVE && onLeftFlingGesture) {
        onLeftFlingGesture()
      }
    }
  }

  const handleRightFlingStateChange = (event) => {
    if (!supressNavigation) {
      const { oldState } = event.nativeEvent
      if (oldState === GestureState.ACTIVE && onRightFlingGesture) {
        onRightFlingGesture()
      }
    }
  }

  return (
    <>
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={handleRightFlingStateChange}>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={handleLeftFlingStateChange}>
          <LayoutContainerView behavior="height" style={{ flex: 1 }}>
            <StatusBar backgroundColor={Colors.primary} />
            <ScreenHeader
              title={headerTitle}
              onNavigationIconPress={headerIconAction}
              navigationIconName={headerIcon}>
              <ActionsContainer>
                {showSearch && (
                  <IconButton
                    icon="search"
                    color={Colors.background}
                    onPress={handleSearchPress}
                  />
                )}
                {showSettings && (
                  <IconButton
                    icon="cog"
                    color={Colors.background}
                    onPress={handleSettingsPress}
                  />
                )}
                {showAddIcon && (
                  <IconButton
                    icon="plus"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleAddPress}
                  />
                )}
                {showSynchronizeIcon &&
                  (isSynchronizing ? (
                    <IconContainer>
                      <RotatingIcon
                        name="sync"
                        size={25}
                        color={Colors.primaryTextLight}
                      />
                    </IconContainer>
                  ) : (
                    <IconButton
                      icon="sync"
                      size={25}
                      color={Colors.primaryTextLight}
                      onPress={handleSynchronizePress}
                    />
                  ))}
                {showInformation && (
                  <IconButton
                    icon="information"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleInformationPress}
                  />
                )}
                {showEdit && (
                  <IconButton
                    icon="account-edit"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleEditPress}
                  />
                )}
                {showDelete && (
                  <IconButton
                    icon="trash-can"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleDeletePress}
                  />
                )}
                {headerNextIconAction && (
                  <IconButton
                    icon="arrow-forward"
                    color={Colors.primaryTextLight}
                    onPress={headerNextIconAction}
                  />
                )}
              </ActionsContainer>
            </ScreenHeader>
            {children}
          </LayoutContainerView>
        </FlingGestureHandler>
      </FlingGestureHandler>
      {!hideFooter && <Footer activeTabIndex={activeTabIndex} />}
    </>
  )
}

export default SignedInLayout
