import { View, Text } from 'react-native'
import React from 'react'
import { useDesignScale } from 'modules/hooks'

export function Title2022() {
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
  return (
      <>
            <View style={{flex: 1}}/>
            <Text style={[appStyles.text16, {marginVertical: HEIGHT(32)}]}>© 2022</Text>
      </>
  )
}