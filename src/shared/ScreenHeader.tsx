import React from 'react'
import { Platform, View } from 'react-native'
import { Appbar } from 'react-native-paper'
import { Colors, Metrics } from '../themes'
import { useNavigation } from '@react-navigation/native'

interface Props {
  navigationIconName?: string
  navigationIconDisabled?: boolean
  title?: string
  subtitle?: string
  children?: JSX.Element
  onNavigationIconPress?: () => void
}

const ScreenHeader: React.FC<Props> = ({
  onNavigationIconPress,
  navigationIconName,
  title,
  subtitle,
  children,
}) => {
  const navigation = useNavigation()
  const handleNavigationIconPress = () => {
    if (onNavigationIconPress) {
      onNavigationIconPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <Appbar.Header style={{ elevation: 0 }}>
      {navigationIconName && (
        <Appbar.Action
          icon={navigationIconName}
          color={Colors.primaryTextLight}
          onPress={handleNavigationIconPress}
        />
      )}
      <Appbar.Content
        title={title}
        subtitle={subtitle}
        style={{ paddingHorizontal: 0 }}
        titleStyle={{
          fontSize: 20,
          color: Colors.primaryTextLight,
          fontWeight: Platform.OS === 'ios' ? '500' : '400',
          alignSelf: 'flex-start',
        }}
        subtitleStyle={{ color: Colors.secondaryText }}
      />
      <View>{children}</View>
    </Appbar.Header>
  )
}

export default ScreenHeader
