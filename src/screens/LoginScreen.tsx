import { useDesignScale } from "modules/hooks"
import React, { useState } from "react"
import { Image, Text, View, Button, TouchableOpacity, Pressable, SegmentedControlIOSBase } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import LinearGradient from "react-native-linear-gradient"
import { Hoshi } from "react-native-textinput-effects"
import { images, appColors } from "assets"
import ToggleSwitch from 'toggle-switch-react-native'
import { StyledButton, GradientListContainer, Title2022 } from "components"
import { testingPhone, testingPasword, imageBase } from "modules/constants"
import { apiLogin } from "modules/api"
import { handleException } from "modules/functions"
import { LoginStackScreenProps } from "./stackNavigator"
import { useDispatch, useSelector } from "react-redux"
import { setProfile } from "reduxsaga/actions"
import { IRootState } from "reduxsaga/reducers"

export const LoginScreen = ({navigation}: LoginStackScreenProps)=>{
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
    const [phone, setPhone] = useState(__DEV__?testingPhone:'')
    const [password, setPassword] = useState(__DEV__?testingPasword:'')
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const districtReducer = useSelector((state: IRootState)=>state.districtReducer)
    const [district, setDistrict] = useState(districtReducer.selectedId)
    const dispatch = useDispatch()
    return (
        <GradientListContainer>
            {
                district&&districtReducer.districts[district].pic?
                <Image
                    style={{
                        alignSelf: 'flex-end',
                        marginEnd: 24,
                        borderRadius: 62,
                        width: WIDTH(124), height: WIDTH(124)}}
                    resizeMode='contain'
                    source={{uri: imageBase+districtReducer.districts[district].pic}}/>
                :
                <Image
                    style={{
                        alignSelf: 'flex-end',
                        marginEnd: 24,
                        width: WIDTH(124), height: WIDTH(124)}}
                    resizeMode='contain'
                    source={images.logo}/>
            }
            <View style={{alignItems: 'center', flex: 1, marginTop: HEIGHT(70)}}>
                <Pressable onPress={()=>navigation.navigate('signup')}>
                    <Text style={[appStyles.text19, {color: appColors.black, textAlign: 'center'}]}>Don't have an account? <Text style={{color: appColors.red, fontWeight: 'bold'}}>Sign Up</Text></Text>
                </Pressable>
                <View>
                    <View style={[appStyles.absolute, appStyles.center]}>
                        <Image
                            style={{
                                marginTop: HEIGHT(140),
                                opacity: 0.2,
                                width: WIDTH(390), height: WIDTH(325)}}
                            resizeMode='contain'
                            source={images.coa}/>
                    </View>
                <Hoshi
                    style={{
                        marginTop: 32,
                        width: WIDTH(327)}}
                    label='Phone'
                    inputStyle={appStyles.hosiInput}
                    defaultValue={phone}
                    labelStyle={{color: appColors.black}}
                    borderColor={appColors.black}
                    onChangeText={setPhone}
                />
                <Hoshi
                    inputStyle={appStyles.hosiInput}
                    style={{
                        marginTop: 32,
                        width: WIDTH(327)}}
                    label='Password'
                    secureTextEntry
                    defaultValue={password}
                    labelStyle={{color: appColors.black}}
                    borderColor={appColors.black}
                    onChangeText={setPassword}
                />
                </View>
                <View style={{marginTop: HEIGHT(32)}}>
                    <ToggleSwitch
                        label='Remember me'
                        isOn={rememberMe}
                        onToggle={setRememberMe}
                        labelStyle={appStyles.text16}
                    />
                </View>
                <StyledButton
                    title='LOGIN'
                    enabled={phone&&password?true:false}
                    loading={loading}
                    style={{
                        marginTop: HEIGHT(50),
                        width: WIDTH(320)}}
                    onPress={()=>{
                        setLoading(true)
                        apiLogin({phone, password}).then(result=>{
                            setLoading(false)
                            dispatch(setProfile(result.user))
                        }).catch(exception=>{
                            setLoading(false)
                            handleException(exception)
                        })
                    }}
                />
                <Pressable style={{marginTop: HEIGHT(48)}}>
                    <Text style={[appStyles.text16, {textDecorationLine: 'underline', color: appColors.black}]}>Forgot Password?</Text>
                </Pressable>
                <Title2022/>
                </View>
        </GradientListContainer>
    )
}