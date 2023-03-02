import { useDesignScale } from "modules/hooks"
import React from "react"
import { GradientListContainer, HotelsHorizontal, NewsHorizontal, ToursHorizontal } from "components"
import { View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { apiHomeNews, apiHotels, apiTours } from "modules/api"
import { successHotels, successNews, successTours } from "reduxsaga/actions"
import { IAdvertise, IHotel, INews, ITour } from "models"
import { IRootState } from "reduxsaga/reducers"

export function HomeScreen() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const dispatch = useDispatch()
    const advertises = useSelector((state: IRootState)=>state.advertiseReducer).filter(item=>item.inNews==1)
    const loadHome = ()=>{
        const newsAdvertises = advertises.filter(item=>item.inNews==1)
        const hotelAdvertises = advertises.filter(item=>item.inNews==1)
        const tourAdvertises = advertises.filter(item=>item.inNews==1)
        apiHomeNews().then(result=>{
            const adNews: (INews|IAdvertise)[] = result.featured_news
            for (const advertise of newsAdvertises) {
                adNews.splice(advertise.adIndex, 0, advertise)
            }
            dispatch(successNews(adNews))
        })
        apiHotels().then(hotels=>{
            const adHotels: (IHotel|IAdvertise)[] = hotels
            for (const advertise of hotelAdvertises) {
                adHotels.splice(advertise.adIndex, 0, advertise)
            }
            dispatch(successHotels(adHotels))
        })
        apiTours().then(tours=>{
            const adTours: (ITour|IAdvertise)[] = tours
            for (const advertise of tourAdvertises) {
                adTours.splice(advertise.adIndex, 0, advertise)
            }
            dispatch(successTours(adTours))
        })
    }
    useFocusEffect(()=>{
        loadHome()
    })
    return (
        <GradientListContainer disableBack>
            <NewsHorizontal/>
            <HotelsHorizontal/>
            <View style={{marginVertical: 4}}>
                <ToursHorizontal/>
            </View>
        </GradientListContainer>
    )
}
