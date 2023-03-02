import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { GradientListContainer } from '../components/GradientListContainer'
import { useDesignScale } from 'modules/hooks'
import { StyledButton, StyledInput, Title2022 } from 'components'
import { appColors } from 'assets'
import { apiCheckVerificationCode, apiUserProfile, apiSendVerificationCode } from 'modules/api'
import { handleException, handleSuccess } from 'modules/functions'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'
import { LoggedInStackScreenProps } from './stackNavigator'
import { clearProfile } from 'reduxsaga/actions'

export function VerifyPhoneScreen({navigation}: LoggedInStackScreenProps) {
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
    const [code, setCode] = useState('')
    const [resendLoading, setResendLoading] = useState(false)
    const [activeLoading, setActiveLoading] = useState(false)
    const dispatch = useDispatch()
    if (!user) {
        return null
    }
    return (
      <GradientListContainer disableBack>
            <View style={{flex: 1, alignItems: 'center', marginHorizontal: 40}}>
            <Text style={[appStyles.title20, {textAlign: 'center', marginTop: HEIGHT(120)}]}>Verify your Phone</Text>
            <StyledInput
                keyboardType='number-pad'
                placeholder='SMS Code' style={{marginTop: 16}} onChangeText={setCode} value={code}/>
            <StyledButton
                onPress={()=>{
                    setActiveLoading(true)
                    apiCheckVerificationCode({user_id: user.id, code}).then(()=>{
                        setActiveLoading(false)
                        navigation.reset({routes: [{
                            name: 'splash'
                        }]})
                    }).catch(exception=>{
                        setActiveLoading(false)
                        handleException(exception)
                    })
                }}
                loading={activeLoading}
                enabled={code.length==4?true:false} title='ACTIVE' style={{marginTop: 16, width: WIDTH(310)}}/>
            <StyledButton
                loading={resendLoading}
                enabled={true} title='RESEND' style={{marginTop: 16, width: WIDTH(310)}}
                onPress={()=>{
                    setResendLoading(true)
                    apiSendVerificationCode({user_id: user.id, user_phone: user.phone}).then(result=>{
                        setResendLoading(false)
                        handleSuccess(result)
                    }).catch(exception=>{
                        setResendLoading(false)
                        handleException(exception)
                    })
                }}/>
            <Pressable
                onPress={()=>{
                    dispatch(clearProfile())
                    navigation.replace('main')
                }}
                style={{marginTop: HEIGHT(48)}}>
                <Text style={[appStyles.text16, {textDecorationLine: 'underline', color: appColors.black}]}>Another login?</Text>
            </Pressable>
            <Title2022/>
            </View>
     </GradientListContainer>
  )
}