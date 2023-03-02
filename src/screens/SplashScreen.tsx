import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import React, { useEffect } from 'react'
import { appColors, images } from 'assets'
import { SplashStackScreenProps } from 'screens'
import { useDesignScale } from 'modules/hooks'
import { apiAdvertises, apiGetDistrict, apiHomeNews, apiHotelKeywords, apiUserProfile } from 'modules/api'
import { handleException } from 'modules/functions'
import { useDispatch, useSelector } from 'react-redux'
import { clearProfile, successDistricts, setProfile, setHotelKeywords, successLoadAdvertise } from 'reduxsaga/actions'
import { IRootState } from 'reduxsaga/reducers'

export function SplashScreen({navigation}: SplashStackScreenProps) {
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    const dispatch = useDispatch()
    const advertise = ()=>{
        setTimeout(()=>{
            navigation.replace('advertise')
        }, 0)
    }
    const handleDistricts = ()=>{
        apiGetDistrict().then(districts=>{
            dispatch(successDistricts(districts))
            if (user) {
                apiUserProfile(user.id).then(user=>{
                    dispatch(setProfile(user))
                    apiHotelKeywords().then(keywords=>{
                        dispatch(setHotelKeywords(keywords))
                        advertise()
                    }).catch(()=>{
                        advertise()
                    })
                }).catch(exception=>{
                    handleException(exception)
                    dispatch(clearProfile())
                    advertise()
                })
            } else {
                advertise()
            }
        }).catch(exception=>{
            handleException(exception)
            advertise()
        })
    }
    useEffect(()=>{
        apiAdvertises().then(advertises=>{
            dispatch(successLoadAdvertise(advertises))
            handleDistricts()
        }).catch(exception=>{
            handleException(exception)
            handleDistricts()
        })
    }, [])
    return (
        <View style={appStyles.container}>
            <StatusBar hidden={true}/>
            <LinearGradient colors={[appColors.background, appColors.purple]}
                style={{
                    flex: 1,
                    alignItems: 'center'
                    }}>
                <Image
                    style={{
                        marginTop: HEIGHT(295),
                        width: WIDTH(234), height: HEIGHT(195)}}
                    resizeMode='contain'
                    source={images.coa}/>
                <Text style={[appStyles.capitalTitle, {marginTop: HEIGHT(30)}]}>DISTRICT{`\n`}INFORMATION{`\n`}SYSTEM</Text>
                <Text style={[appStyles.text16, {marginTop: HEIGHT(163)}]}>© 2022</Text>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({})