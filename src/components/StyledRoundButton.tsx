import { appColors, fonts } from "assets"
import { useDesignScale } from "modules/hooks"
import React from "react"
import { GestureResponderEvent, StyleProp, Text, TextStyle, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from 'react-native-progress'
import { Shadow } from "react-native-shadow-2"

export const StyledRoundButton = ({loading, style, onPress, title, titleColor, enabled}: {loading?: boolean, enabled?: boolean, title: string, titleColor?: string, style?: StyleProp<TextStyle>, onPress?: ((event: GestureResponderEvent) => void)}) => {
    const {WIDTH, FONT, HEIGHT} = useDesignScale()
    return (
        <View style={style}>
        <Shadow offset={[0, 2]} distance={5} radius={32}>
            <TouchableOpacity
                style={{
                    borderRadius: 32,
                    borderColor: appColors.buttonBorder, borderWidth: 1}}
                onPress={(enabled&&!loading)?onPress:undefined}>
                <LinearGradient
                    start={{x: 0.0, y: 0.0}} end={{x: 0.25, y: 0.25}}
                    style={[{ borderRadius: 32, justifyContent: 'center'}]}
                    colors={[appColors.white, appColors.button1]}
                >
                <Text style={{
                    paddingVertical: 8,
                    marginStart: 16,
                    marginEnd: loading?32:16,
                    fontFamily: fonts.Montserrat,
                    fontSize: FONT(16), fontWeight: 'bold', color: enabled?(titleColor?titleColor:appColors.white):appColors.grey, textAlign: 'center'}}>{title}</Text>
                {loading && <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, bottom: 0, right: 0, marginEnd: 16}} >
                    <Progress.Circle size={WIDTH(16)} borderWidth={2} indeterminate={true} color={appColors.white} />
                </View>}
                </LinearGradient>
            </TouchableOpacity>
        </Shadow>
        </View>
    )
}