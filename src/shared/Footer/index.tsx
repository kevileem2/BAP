import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { FooterContainer, Section, Icon } from './components'
import { Colors } from '../../themes'
import { pageKeys } from './constants'
import { useNavigation } from '@react-navigation/native'

interface FooterProps {
  activeTabIndex: number
}

export default ({ activeTabIndex }: FooterProps) => {
  const navigation = useNavigation()

  const getIconName = (page: string) => {
    switch (page) {
      case pageKeys.DASHBOARD:
        return activeTabIndex === 0 ? 'home' : 'home-outline'
      case pageKeys.CLIENTS:
        return activeTabIndex === 1 ? 'account-group' : 'account-group-outline'
      case pageKeys.PROFILE:
        return activeTabIndex === 2 ? 'account' : 'account-outline'
      case pageKeys.SETTINGS:
        return activeTabIndex === 3 ? 'cog' : 'cog-outline'
    }
  }

  const handleDasboardPress = () => {
    if (activeTabIndex !== 0) {
      navigation.navigate('Dashboard')
    }
  }
  const handleClientsPress = () => {
    if (activeTabIndex !== 1) {
      navigation.navigate('Clients')
    }
  }
  const handleProfilePress = () => {
    if (activeTabIndex !== 2) {
      navigation.navigate('Profile')
    }
  }
  const handleSettingsPress = () => {
    if (activeTabIndex !== 3) {
      navigation.navigate('Settings')
    }
  }

  return (
    <FooterContainer>
      <Section>
        <TouchableWithoutFeedback onPress={handleDasboardPress}>
          <Icon
            name={getIconName(pageKeys.DASHBOARD)}
            size={22}
            color={Colors.primaryTextLight}
          />
        </TouchableWithoutFeedback>
      </Section>
      <Section>
        <TouchableWithoutFeedback onPress={handleClientsPress}>
          <Icon
            name={getIconName(pageKeys.CLIENTS)}
            size={22}
            color={Colors.primaryTextLight}
          />
        </TouchableWithoutFeedback>
      </Section>
      {/* <Section>
        <TouchableWithoutFeedback onPress={handleProfilePress}>
          <Icon
            name={getIconName(pageKeys.PROFILE)}
            size={22}
            color={Colors.primaryTextLight}
          />
        </TouchableWithoutFeedback>
      </Section> */}
      {/* <Section>
        <TouchableWithoutFeedback onPress={handleSettingsPress}>
          <Icon
            name={getIconName(pageKeys.SETTINGS)}
            size={22}
            color={Colors.primaryTextLight}
          />
        </TouchableWithoutFeedback>
      </Section> */}
    </FooterContainer>
  )
}
