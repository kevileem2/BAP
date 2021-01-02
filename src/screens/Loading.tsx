import React, { useContext } from 'react'
import { RealmContext } from '../App'
import { Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Metrics } from '../themes'
import { formatMessage, RotatingIcon } from '../shared'

export default () => {
  const realm = useContext(RealmContext)
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[Colors.buttonColorLight, Colors.buttonColorDark]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 34,
          fontWeight: '700',
          color: Colors.primaryTextLight,
          marginTop: Metrics.largeMargin,
          marginBottom: Metrics.largeMargin,
        }}>
        {formatMessage('fetchingData', realm)}
      </Text>
      <RotatingIcon name="sync" size={48} color={Colors.primaryTextLight} />
    </LinearGradient>
  )
}
