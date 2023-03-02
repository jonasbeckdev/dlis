import { appColors, images } from "assets";
import { apiHotelKeywords, apiHotels, apiTours } from "modules/api";
import { imageBase } from "modules/constants";
import { useDesignScale } from "modules/hooks";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { IAdvertise, ITour } from "models";
import { useNavigation } from "@react-navigation/native";
import { Shadow } from "react-native-shadow-2";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "reduxsaga/reducers";
import { TourDetailTabNavigationProp } from "../screens/TabScreen";
import { successTours } from "reduxsaga/actions";

export function TourHozizontalAdItem({ad}: {ad: IAdvertise}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const navigation = useNavigation<TourDetailTabNavigationProp>()
    return (
        <View
            style={{marginHorizontal: 4}}>
            <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
            <Image source={{uri: imageBase+ad.pic}}
                style={{borderRadius: 8, width: WIDTH(420), aspectRatio: 4/3}}
                resizeMode='contain' />
            </Shadow>
        </View>
    )
}

export function TourHozizontalItem({tour}: {tour: ITour}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const navigation = useNavigation<TourDetailTabNavigationProp>()
    return (
        <Pressable
            style={{marginHorizontal: 4}}
            onPress={()=>navigation.navigate('tourDetail', {tour})}>
            <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
            <Image source={{uri: imageBase+tour.pics[0]}}
                style={{borderRadius: 8, width: WIDTH(420), aspectRatio: 4/3}}
                resizeMode='contain' />
            </Shadow>
            <View style={{
                position: 'absolute',
                backgroundColor: appColors.bottomLine,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                padding: 16,
                left: 0, right: 0, bottom: 0, height: WIDTH(100) }}>
                <View style={[appStyles.rowCenter, {justifyContent: 'space-between'}]}>
                    <Text style={[appStyles.text10, {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderWidth: 1,
                        borderRadius: 15,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        borderColor: appColors.greenBorder,
                        color: appColors.white}]}>{tour.name}</Text>
                </View>
                <View style={[appStyles.rowCenter, {marginTop: 16, justifyContent: 'space-between'}]}>
                    <View/>
                    <Text style={appStyles.contactUs}>Contact us</Text>
                </View>

            </View>
        </Pressable>
    )
}
export function ToursHorizontal() {
    const advertises = useSelector((state: IRootState)=>state.advertiseReducer).filter(item=>item.inTourism==1)
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    // const [tours, setTours] = useState<(ITour|IAdvertise)[]>()
    const tours = useSelector((state: IRootState)=>state.tourReducer.tours)
    const navigation = useNavigation<TourDetailTabNavigationProp>()
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     apiTours().then(tours=>{
    //         const adTours: (ITour|IAdvertise)[] = tours
    //         for (const advertise of advertises) {
    //             adTours.splice(advertise.adIndex, 0, advertise)
    //         }
    //         dispatch(successTours(adTours))
    //     })
    // }, [])
    return (
        <View>
            <FlatList
                horizontal
                style={{marginStart: WIDTH(4)}}
                ItemSeparatorComponent={()=><View style={{width: WIDTH(4)}}/>}
                data={tours}
                keyExtractor={(item, index)=>index.toString()}
                renderItem={({item, index})=>{
                    const tour = item as ITour
                    const ad = item as IAdvertise
                    if (ad.inTourism == 1) {
                        return (
                            <TourHozizontalAdItem ad={ad}/>
                        )
                    }
                    return (
                        <TourHozizontalItem tour={tour}/>
                    )
                }}
            />
            {
                tours && tours.length > 0 &&
                <Pressable
                    style={{
                        position: 'absolute',
                        left: -10,
                        top: 36,
                    }}
                    onPress={()=>navigation.navigate('tourism')}>
                    <Image
                        source={images.tourism}
                    />
                </Pressable>
            }
        </View>
    )
}