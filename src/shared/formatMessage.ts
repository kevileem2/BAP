import { NativeModules, Platform } from 'react-native'
import { UserSession } from '../utils/storage';

export const formatMessage = (message: string, realm: Realm | undefined) => {
  let language;
  const userSession = realm?.objects<UserSession>('UserSession')?.[0]
  if(userSession?.language) {
    language = userSession.language
  } else {
    const locale: string | undefined =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier
  
    language = locale?.substring(0, 2).toLowerCase() || 'en'
  }
  const translations = {
    en: require('../i18n/en.json'),
    nl: require('../i18n/nl.json'),
    fr: require('../i18n/fr.json'),
  }

  return (
    translations[language][message] ||
    `missing [${language}]: ${message} translation`
  )
}

export const localeString = (realm: Realm | undefined) => {
  const userSession = realm?.objects<UserSession>('UserSession')?.[0]
  if(userSession?.language) {
    return userSession?.language
  }
  return (Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier) || 'en-US'
}
