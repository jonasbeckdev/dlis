import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { GradientListContainer, TourHozizontalItem } from 'components'
import { ITour } from 'models'
import { apiTours } from 'modules/api'

export function TourismScreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [tours, setTours] = useState<ITour[]>()
    useEffect(()=>{
        apiTours().then(result=>{
            setTours(result)
        })
    }, [])
    return (
        <GradientListContainer>
            <View style={{flex: 1, marginTop: 16}}>
                <View style={{alignItems: 'flex-end', marginEnd: 16}}>
                    <Text style={appStyles.menuTitle}>Tourism</Text>
                </View>
                {
                    tours?.map(tour=>{
                        return (
                            <View
                                key={tour.id}
                                style={{marginBottom: 8}}>
                            <TourHozizontalItem
                                tour={tour}/>
                            </View>
                        )
                    })
                }
            </View>
        </GradientListContainer>
    )
}