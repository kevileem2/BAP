import React from 'react'
import { Avatar } from 'react-native-paper'
import { Colors } from '../themes'

interface Props {
  firstName: string
  lastName: string
  size: number
}

/**
 * All different background colors the avatar initials can have
 */
const avatarColors = [
  '#00AA55',
  '#009FD4',
  '#B381B3',
  '#939393',
  '#E3BC00',
  '#D47500',
  '#DC2A2A',
  '#b19cd9',
  '#aec6cf',
  '#f6ad7b',
  '#be7575',
  '#000',
]

/**
 * Render function for rendering the avatar
 */
const renderAvatar = ({ firstName, lastName, size }: Props) => {
  let initialsLabel
  let backgroundColorAvatar = avatarColors[0]

  /**
   * • checks if the userName has more than 2 words
   * • splits the words of the username and only gets the first character
   */
  if (firstName) {
    initialsLabel = `${firstName[0].toLocaleUpperCase()}${lastName[0].toLocaleUpperCase()}`
    // maps the characters with their respective character codes
    const charCodes = parseInt(
      initialsLabel
        .split('')
        .map((char) => char.charCodeAt(0))
        .join(''),
      10
    )

    // uses the charCodes variable to map a color from the avatarColors array
    backgroundColorAvatar = avatarColors[charCodes % avatarColors.length]
  }

  // returns the styled initials text
  return firstName && lastName ? (
    <Avatar.Text
      size={size}
      label={initialsLabel}
      color={Colors.primaryTextLight}
      style={{ backgroundColor: backgroundColorAvatar }}
    />
  ) : (
    <Avatar.Text size={size} label="" color={Colors.primaryTextLight} />
  )
}

export default renderAvatar
