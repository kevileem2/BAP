import Realm from 'realm'
import { storage } from '../utils'

export interface ErrorMessage {
  data?: {
    details?: string
    message?: string
    reportError?: string
    validationMessage?: string
  }
  response?: {
    data?: {
      details?: string
      message?: string
      reportError?: string
      validationMessage?: string
    }
  }
}

interface MessagePayload {
  message: ErrorMessage | string
  realm?: Realm
}

export default async ({ message, realm }: MessagePayload) => {
  console.log('comes in here')
  let errorMessage =
    typeof message === 'string' ? message : 'Something went wrong'
  let errorDetails = ''

  if (
    typeof message !== 'string' &&
    (message?.data?.reportError || message?.data?.validationMessage)
  ) {
    errorMessage = `${message.data.reportError}${
      message?.data?.validationMessage
        ? `: ${message.data.validationMessage}`
        : ''
    }`
  }

  if (typeof message !== 'string' && message?.data?.message) {
    errorMessage =
      errorMessage === 'Something went wrong'
        ? message.data.message
        : errorMessage

    errorDetails =
      errorMessage !== message.data.message ? message.data.message : ''
  }

  if (typeof message !== 'string' && message?.response?.data?.message) {
    errorMessage =
      errorMessage === 'Something went wrong'
        ? message.response.data.message
        : errorMessage

    errorDetails =
      errorMessage !== message.response.data.message
        ? message.response.data.message
        : ''
  }
  await storage.writeTransaction((realmInstance) => {
    realmInstance.create(
      'UserSession',
      { type: 'singleInstance', error: errorMessage, loading: false },
      Realm.UpdateMode.All
    )
  }, realm)
}
