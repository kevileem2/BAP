import { NativeModules, Platform } from 'react-native'

export const formatMessage = (message: string) => {
  const locale: string | undefined =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier

  const language = locale?.substring(0, 2).toLowerCase() || 'en'
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

export const localeString = () =>
  (Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier) || 'en-US'
