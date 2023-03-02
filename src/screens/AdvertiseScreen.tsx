import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { appColors, images } from 'assets'
import { adCountdown, imageBase } from 'modules/constants'
import { SplashStackScreenProps } from 'screens'
import { useDesignScale } from 'modules/hooks'
import { useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'

export function AdvertiseScreen({navigation}: SplashStackScreenProps) {
    const {appStyles, WIDTH} = useDesignScale()
    const advertises = useSelector((state: IRootState)=>state.advertiseReducer).filter(item=>item.inIntro==1)
    const [picIndex, setPicIndex] = useState<number>()
    useEffect(()=>{
        if (advertises.length > 0) {
            setPicIndex(0)
        } else {
            navigation.replace('main')
        }
    }, [])

    return (
    <View style={[appStyles.container, appStyles.center]}>
        {
            picIndex != undefined
            ?
            <Image
                onLoadEnd={()=>{
                    if ((picIndex+1) < advertises.length) {
                        setTimeout(()=>{
                            setPicIndex(picIndex+1)
                        }, 1000*advertises[picIndex].delay)
                    } else {
                        setTimeout(()=>{
                            navigation.replace('main')
                        }, 1000*advertises[picIndex].delay)
                    }
                }}
                source={{uri: imageBase+advertises[picIndex].pic}} resizeMode='stretch' style={{width: '100%', height: '100%'}} />
            :
            <Image source={images.ad} resizeMode='contain'/>
        }
        <View style={[appStyles.absolute, {top: 16, right: 16, alignItems: 'flex-end'}]}>
            {
                picIndex != undefined &&
                <CountdownCircleTimer
                    size={WIDTH(38)}
                    isPlaying
                    // @ts-ignore
                    colors={appColors.border1}
                    duration={advertises[picIndex].delay}
                    onComplete={()=>{
                        navigation.replace('main')
                    }}
                    strokeWidth={3}
                    children={n=><Text>{n.remainingTime}</Text>}
                />
            }
        </View>
    </View>
    )
}
