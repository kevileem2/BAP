import React, { FC, useEffect, useState } from 'react'
import { Dimensions, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { Colors, Metrics } from '../themes'
import { formatMessage } from './'
import { RotatingIcon } from '../shared'
import {
  ModalCardRounded as ModalCardRoundedStyled,
  ModalText,
  ModalButtonsContainer,
  ModalTitle,
  ModalIcon,
  ModalBackgroundEllipse,
  ModalRotatingIConContainer,
  AdditionalInfo,
  AdditionalInfoContainer,
} from './components'

interface Props {
  icon?: string
  iconColor?: string
  title?: string
  text?: string
  confirmButtonText?: string
  confirmButtonColor?: string
  cancelButtonText?: string
  cancelButtonColor?: string
  hideButtons?: boolean
  hideCancelButton?: boolean
  rotatingIcon?: boolean
  speech?: boolean
  realm?: Realm
  handleConfirmAction?: () => void
  handleCancelAction?: () => void
  hideModal: () => void
}

const ModalCardRounded: FC<Props> = ({
  icon,
  iconColor,
  title,
  text,
  confirmButtonColor,
  confirmButtonText,
  cancelButtonColor,
  cancelButtonText,
  hideButtons,
  hideCancelButton,
  rotatingIcon,
  speech,
  realm,
  handleConfirmAction,
  handleCancelAction,
  hideModal,
}: Props) => {
  const [width, setWidth] = useState<number>(Dimensions.get('window').width)

  // const realm = useContext(RealmContext)

  useEffect(() => {
    handleDimensionsChange()
    Dimensions.addEventListener('change', handleDimensionsChange)

    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange)
    }
  }, [])

  const handleDimensionsChange = () => {
    setWidth(Dimensions.get('window').width)
  }

  return (
    <ModalCardRoundedStyled>
      <ModalBackgroundEllipse width={width} />
      {rotatingIcon ? (
        <ModalRotatingIConContainer>
          <RotatingIcon
            name={icon || 'delete'}
            color={iconColor || Colors.errorLight}
            size={36}
          />
        </ModalRotatingIConContainer>
      ) : (
        <ModalIcon
          size={36}
          name={icon || 'delete'}
          color={iconColor || Colors.errorLight}
        />
      )}
      <ModalTitle>
        {title
          ? formatMessage(title, realm)
          : formatMessage('deleteRecord', realm)}
      </ModalTitle>
      {speech ? (
        <AdditionalInfoContainer>
          <AdditionalInfo>
            • {formatMessage('speakClearly', realm)}
          </AdditionalInfo>
          <AdditionalInfo>
            • {formatMessage('recordNoteCompletely', realm)}
          </AdditionalInfo>
          <AdditionalInfo>
            • {formatMessage('speakPunctuation', realm)}
          </AdditionalInfo>
          <AdditionalInfo>
            • {formatMessage('punctuationExample', realm)}
          </AdditionalInfo>
        </AdditionalInfoContainer>
      ) : (
        <ModalText>
          {text
            ? formatMessage(text, realm)
            : formatMessage('deleteConfirmation', realm)}
        </ModalText>
      )}
      {!hideButtons && (
        <ModalButtonsContainer>
          <Button
            mode="text"
            color={confirmButtonColor || Colors.errorLight}
            onPress={handleConfirmAction}
            style={{
              marginRight: !hideCancelButton ? Metrics.baseMargin : 0,
            }}>
            <Text style={{ fontWeight: '800', fontSize: 14 }}>
              {confirmButtonText
                ? formatMessage(confirmButtonText, realm).toUpperCase()
                : formatMessage('yes', realm).toUpperCase()}
            </Text>
          </Button>
          {!hideCancelButton && (
            <Button
              mode="text"
              onPress={handleCancelAction ?? hideModal}
              color={cancelButtonColor || Colors.primaryText}>
              <Text style={{ fontWeight: '400', fontSize: 14 }}>
                {cancelButtonText
                  ? formatMessage(cancelButtonText, realm).toUpperCase()
                  : formatMessage('no', realm).toUpperCase()}
              </Text>
            </Button>
          )}
        </ModalButtonsContainer>
      )}
    </ModalCardRoundedStyled>
  )
}

export default ModalCardRounded
