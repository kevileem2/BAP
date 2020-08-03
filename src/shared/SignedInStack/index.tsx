import React from 'react'
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
  showSynchronizeIcon?: boolean
  showNotifications?: boolean
  showDashboard?: boolean
  showInformation?: boolean
  showAddIcon?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showLogout?: boolean
  notificationCount?: number
  activeTabIndex: number
  isSynchronizing?: boolean
  nextAction?: () => void
  backAction?: () => void
  headerIconAction?: () => void
  handleInformationPress?: () => void
  handleSynchronizePress?: () => void
  handleAddPress?: () => void
  handleEditPress?: () => void
  handleDeletePress?: () => void
  handleLogoutPress?: () => void
  onLeftFlingGesture?: () => void
  onRightFlingGesture?: () => void
}

const SignedInLayout: React.FC<Props> = ({
  headerIcon,
  headerTitle,
  hideFooter,
  children,
  supressNavigation,
  showSynchronizeIcon,
  showAddIcon,
  showInformation,
  showEdit,
  showDelete,
  showLogout,
  activeTabIndex,
  isSynchronizing,
  headerIconAction,
  handleInformationPress,
  handleSynchronizePress,
  handleAddPress,
  handleEditPress,
  handleDeletePress,
  handleLogoutPress,
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
          <LayoutContainerView behavior="padding" style={{ flex: 1 }}>
            <StatusBar backgroundColor={Colors.primary} />
            <ScreenHeader
              title={headerTitle}
              onNavigationIconPress={headerIconAction}
              navigationIconName={headerIcon}>
              <ActionsContainer>
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
                {showLogout && (
                  <IconButton
                    icon="logout"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleLogoutPress}
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
