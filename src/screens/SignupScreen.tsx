import { View, Text } from 'react-native'
import React, { useState } from 'react'
import {
    ModalContainer,
    GradientListContainer, StyledButton, StyledInput } from 'components'
import { useDesignScale } from 'modules/hooks'
import { appColors } from 'assets'
import { LoginStackScreenProps } from './stackNavigator'
import Feather from 'react-native-vector-icons/Feather'
import { apiSignup } from 'modules/api'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'
import { testingFamilyPhone, testingName, testingPasword, testingPhone } from 'modules/constants'
import { handleException } from 'modules/functions'
import { setProfile } from 'reduxsaga/actions'

export function SignupScreen({navigation}: LoginStackScreenProps) {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [step, setStep] = useState(1)
    const [name, setFullName] = useState(__DEV__?testingName:'')
    const [phone, setPhone] = useState(__DEV__?testingPhone:'')
    const [family_phone, setEmergencyContact] = useState(__DEV__?testingFamilyPhone:'')
    const [password, setPassword] = useState(__DEV__?testingPasword:'')
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const districtReducer = useSelector((state: IRootState)=>state.districtReducer)
    const district = districtReducer.districts[districtReducer.selectedId!]
    const [loading, setLoading] = useState(false)
    const [successModal, setSuccessModal] = useState(false)
    const dispatch = useDispatch()
    return (
    <GradientListContainer
        onBack={()=>{
            if (step > 1) {
                setStep(step-1)
            } else {
                navigation.goBack()
            }
        }}
    >
        <View style={{flex: 1, marginHorizontal: 50, marginBottom: 32}}>
            <Text style={[appStyles.title20, {textAlign: 'center', marginTop: HEIGHT(120)}]}>Sign up</Text>
            <Text style={[appStyles.subTitle14, {marginTop: HEIGHT(100)}]}>STEP {step} OF 3</Text>
            {
                step == 1 &&
                <>
                <Text style={[appStyles.title20, {marginTop: 16}]}>What's your Name?</Text>
                <Text style={[appStyles.text14, {marginTop: 16}]}>Please enter your full name beginning with your surname(last name).</Text>
                <StyledInput placeholder='Enter your full name' style={{marginTop: 16}} onChangeText={setFullName} value={name}/>
                <StyledButton enabled={name?true:false} title='NEXT' style={{marginTop: 16}} onPress={()=>setStep(2)}/>
                <Text style={[appStyles.text10, {textAlign: 'center', marginHorizontal: 60, marginTop: 16}]}>By continuing, you agree to accept our Privacy Policy & Terms of Service.</Text>
                </>
            }
            {
                step == 2 &&
                <>
                <Text style={[appStyles.title20, {marginTop: 16}]}>What’s your phone?</Text>
                <StyledInput keyboardType='phone-pad' placeholder='Phone' style={{marginTop: 16}} onChangeText={setPhone} value={phone}/>
                <Text style={[appStyles.title20, {marginTop: 16}]}>Enter a number to call in case of an emergency?</Text>
                <StyledInput keyboardType='phone-pad' placeholder='emergency contact' style={{marginTop: 16}} onChangeText={setEmergencyContact} value={family_phone}/>
                <StyledButton enabled={phone&&family_phone?true:false} title='NEXT' style={{marginTop: 16}} onPress={()=>setStep(3)}/>
                </>
            }
            {
                step == 3 &&
                <>
                <Text style={[appStyles.title20, {marginTop: 16}]}>Create a password</Text>
                <Text style={[appStyles.text14, {marginTop: 16}]}>Must be at least 6 characters long.</Text>
                <View
                    style={{
                        // borderWidth: 1, borderColor: 'red',
                        marginTop: 16
                    }}
                    >
                    <StyledInput
                        style={{paddingEnd: 32}} secureTextEntry={secureTextEntry} placeholder='Password' value={password} onChangeText={setPassword}/>
                    <View style={{position: 'absolute', top: 0, bottom: 0, right: 16, justifyContent: 'center'}}>
                        <Feather
                            onPress={()=>{
                                setSecureTextEntry(!secureTextEntry)
                            }}
                            name='eye-off' size={16} color={appColors.black}/>
                    </View>
                </View>
                <View style={appStyles.borderStart}>
                    <Text style={appStyles.greyText12}>Your Fullname</Text>
                    <Text style={appStyles.text14}>{name}</Text>
                </View>
                <View style={appStyles.borderStart}>
                    <Text style={appStyles.greyText12}>Your Phone</Text>
                    <Text style={appStyles.text14}>{phone}</Text>
                </View>
                <View style={appStyles.borderStart}>
                    <Text style={appStyles.greyText12}>Emergency Contact</Text>
                    <Text style={appStyles.text14}>{family_phone}</Text>
                </View>
                <View style={appStyles.borderStart}>
                    <Text style={appStyles.greyText12}>Slected District</Text>
                    <Text style={appStyles.text14}>{district.name}</Text>
                </View>
                <StyledButton
                    loading={loading}
                    onPress={()=>{
                        setLoading(true)
                        apiSignup({phone, name, family_phone, password, district_id: district.id}).then(user_id=>{
                            setLoading(false)
                            dispatch(setProfile({id: user_id, phone, name, district_id: district.id, family_phone}))
                            setSuccessModal(true)
                        }).catch(exception=>{
                            setLoading(false)
                            handleException(exception)
                        })
                    }}
                    style={{marginTop: 16}} title='SIGN UP' enabled={password.length>=6}/>
                </>
            }
        </View>
        <ModalContainer
            isVisible={successModal}
            title='Successful Registration !'
        >
            <View style={{
                paddingHorizontal: 40,
                paddingVertical: 16,
                backgroundColor: appColors.white
            }}>
                <Text style={[appStyles.text12, {textAlign: 'center', color: appColors.grey}]}>Thank you for taking the time to signup. You have been successfully registered. You can now proceed to Login</Text>
                <StyledButton
                    style={{
                        marginTop: 48}}
                    enabled
                    onPress={()=>{
                        setSuccessModal(false)
                    }}
                    title='Done'                
                />
            </View>
        </ModalContainer>
     </GradientListContainer>
  )
}