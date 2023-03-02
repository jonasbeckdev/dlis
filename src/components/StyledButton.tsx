import { appColors, fonts } from "assets"
import { useDesignScale } from "modules/hooks"
import React from "react"
import { GestureResponderEvent, StyleProp, Text, TextStyle, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from 'react-native-progress'
import { Shadow } from "react-native-shadow-2"

export const StyledButton = ({loading, style, onPress, title, titleColor, enabled}: {loading?: boolean, enabled?: boolean, title: string, titleColor?: string, style?: StyleProp<TextStyle>, onPress?: ((event: GestureResponderEvent) => void)}) => {
    const {WIDTH, FONT, HEIGHT} = useDesignScale()
    return (
        <TouchableOpacity
            style={[{
                borderRadius: 5,
                backgroundColor: '#CA98CF',
                borderColor: appColors.buttonBorder, borderWidth: 1}, style]}
            onPress={(enabled&&!loading)?onPress:undefined}>
            <Text style={{
                paddingVertical: 8,
                marginStart: 16,
                marginEnd: loading?32:16,
                fontFamily: fonts.Montserrat,
                fontSize: FONT(16), fontWeight: 'bold', color: enabled?(titleColor?titleColor:appColors.white):appColors.grey, textAlign: 'center'}}>{title}</Text>
            {loading && <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, bottom: 0, right: 0, marginEnd: 16}} >
                <Progress.Circle size={WIDTH(16)} borderWidth={2} indeterminate={true} color={appColors.white} />
            </View>}
        </TouchableOpacity>
    )
}