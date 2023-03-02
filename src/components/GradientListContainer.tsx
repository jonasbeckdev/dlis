import { View, Text } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { appColors } from '../assets/colors'
import { useDesignScale } from 'modules/hooks'
import { useNavigation } from '@react-navigation/native'

interface GradientContainerProps {
    children: JSX.Element | JSX.Element[]
    disableBack?: boolean
    translucentBack?: boolean
    onBack?(): void
}
export function GradientListContainer({children, disableBack, translucentBack, onBack}: GradientContainerProps) {
    const navigation = useNavigation()
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
    return (
    <LinearGradient
        colors={[appColors.background, appColors.purple]}
        style={{
            flex: 1,
            // height: HEIGHT(926),
            // borderColor: 'red', borderWidth: 1,
            }}>
        {
            disableBack != true && translucentBack != true &&
            <View style={{
                justifyContent: 'space-between',
                flexDirection: 'row', marginTop: HEIGHT(32), marginHorizontal: WIDTH(32)}}>
                <AntDesign
                    name='arrowleft'
                    size={WIDTH(24)}
                    color={appColors.black}
                    onPress={()=>{
                        if (onBack) {
                            onBack()
                        } else {
                            navigation.goBack()
                        }
                    }}
                />
            </View>
        }
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps='always'
            contentContainerStyle={{flexGrow: 1}}
            style={{flex: 1}}>
            {children}
            {
            disableBack != true && translucentBack &&
            <View style={{position: 'absolute', left: 0, right: 0, top: 0,
                justifyContent: 'space-between',
                flexDirection: 'row', marginTop: HEIGHT(32), marginHorizontal: WIDTH(32)}}>
                <AntDesign
                    name='arrowleft'
                    size={WIDTH(24)}
                    color={appColors.black}
                    onPress={()=>{
                        if (onBack) {
                            onBack()
                        } else {
                            navigation.goBack()
                        }
                    }}
                />
            </View>
        }
        </KeyboardAwareScrollView>
    </LinearGradient>
  )
}