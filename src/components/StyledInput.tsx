import { Text, TextInput, TextInputProps, View } from 'react-native'
import React from 'react'
import { useDesignScale } from 'modules/hooks'
import { appColors } from 'assets'

export function StyledInput({style, secureTextEntry, ...props}: TextInputProps) {
  const {HEIGHT, FONT, WIDTH} = useDesignScale()
  return (
    <TextInput
      secureTextEntry={secureTextEntry}
      {...props}
      style={[{fontSize: FONT(14),
        paddingVertical: 8,
        paddingHorizontal: 16,
          color: appColors.black,
          borderRadius: 5,
          backgroundColor: 'white'}, style]}
      placeholderTextColor={appColors.placeholder}
      autoCapitalize='none'
      autoComplete='off'
      autoCorrect={false}
    />
  )
}
