import React, { useContext, useEffect, useState } from 'react'
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
import AsyncStorage from '@react-native-community/async-storage'
import storage, { User } from '../../utils/storage'
import { clearRealmStorage } from '../../utils/dataUtils'
import { RealmContext } from '../../App'
import { AuthContext } from '../../Navigator'
import { useModal } from '../../utils/ModalProvider'
import ModalCardRounded from '../../shared/ModalCardRounded'

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
  showAddTask?: boolean
  notificationCount?: number
  activeTabIndex?: number
  isSynchronizing?: boolean
  nextAction?: () => void
  backAction?: () => void
  headerIconAction?: () => void
  handleInformationPress?: () => void
  handleAddPress?: () => void
  handleEditPress?: () => void
  handleSynchronizePress?: () => void
  handleDeletePress?: () => void
  handleAddTaskPress?: () => void
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
  showAddTask,
  activeTabIndex,
  isSynchronizing,
  headerIconAction,
  handleInformationPress,
  handleAddPress,
  handleEditPress,
  handleDeletePress,
  handleSynchronizePress,
  handleAddTaskPress,
  onLeftFlingGesture,
  onRightFlingGesture,
}) => {
  const realm = useContext(RealmContext)

  const { signOut } = useContext(AuthContext)

  const { showModal, hideModal } = useModal()

  const [activeTab, setActiveTab] = useState(activeTabIndex)
  useEffect(() => {
    setActiveTab(activeTabIndex)
  }, [activeTabIndex])

  const handleLeftFlingStateChange = ({ nativeEvent }) => {
    if (!supressNavigation) {
      const { state } = nativeEvent
      if (state === GestureState.ACTIVE && onLeftFlingGesture) {
        onLeftFlingGesture()
      }
    }
  }

  const showLogoutConfirmation = () => {
    showModal(
      <ModalCardRounded
        title="logout"
        text="saveConfirmation"
        handleConfirmAction={handleLogoutPress}
        hideModal={hideModal}
        realm={realm}
      />
    )
  }

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem('isLoggedIn')
    await AsyncStorage.removeItem('refresh_token')
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('userId')
    await storage.writeTransaction((realmInstance: Realm) => {
      const user = realmInstance.objects<User>('User')
      realmInstance.delete(user)
      realmInstance.create(
        'UserSession',
        {
          type: 'singleInstance',
          email: null,
          fullName: null,
        },
        Realm.UpdateMode.All
      )
    })
    if (realm) {
      await clearRealmStorage(realm)
    }
    signOut && signOut()
    hideModal()
  }

  const handleRightFlingStateChange = ({ nativeEvent }) => {
    if (!supressNavigation) {
      const { state } = nativeEvent
      if (state === GestureState.ACTIVE && onRightFlingGesture) {
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
                {showAddTask && (
                  <IconButton
                    icon="clipboard-check-outline"
                    size={25}
                    color={Colors.primaryTextLight}
                    onPress={handleAddTaskPress}
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
                    onPress={showLogoutConfirmation}
                  />
                )}
              </ActionsContainer>
            </ScreenHeader>
            {children}
          </LayoutContainerView>
        </FlingGestureHandler>
      </FlingGestureHandler>
      {!hideFooter && <Footer activeTabIndex={activeTab} />}
    </>
  )
}

export default SignedInLayout
