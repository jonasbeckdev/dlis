import { useNavigation } from "@react-navigation/native";
import { appColors, images } from "assets";
import { apiHotels } from "modules/api";
import { imageBase } from "modules/constants";
import { useDesignScale } from "modules/hooks";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "reduxsaga/reducers";
import { HotelDetailTabNavigationProp, TabNavigationProp } from "screens";
import { IAdvertise, IHotel } from "models";
import { Shadow } from "react-native-shadow-2";
import { successHotels } from "reduxsaga/actions";

export function HotelSmalHeightItem({hotel, width}: {hotel: IHotel, width: number}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const keywords = useSelector((state: IRootState)=>state.hotelReducer.keywords)
    const navigation = useNavigation<HotelDetailTabNavigationProp>()
    return (
        <Pressable
            onPress={()=>navigation.navigate('hotelDetail', {hotel})}
            style={[appStyles.rowCenter, {
                borderWidth: 1,
                padding: 16,
                borderRadius: 16,
                borderColor: appColors.white,
                backgroundColor: `#00000050`,
                marginHorizontal: 8
            }]}>
            {
                hotel.pics && hotel.pics.length > 0 &&
                <Image source={{uri: imageBase+hotel.pics[0]}}
                    style={{
                        borderRadius: 8,
                        // marginHorizontal: 8,
                        width: WIDTH(150),
                        height: WIDTH(120),
                    }}
                    resizeMode='stretch'
                />
            }
            <View style={{marginHorizontal: 16, flex: 1}}>
                <Text style={{backgroundColor: appColors.black, color: appColors.white, borderRadius: 8, padding: 5}}>{hotel.name}</Text>
                <ScrollView style={{marginTop: 16, flexGrow: 1}} contentContainerStyle={{flexDirection: 'row', justifyContent: 'space-between'}} horizontal>
                {
                    hotel.keywords.map(keyowrd=>{
                        return (
                            <Text
                                key={keyowrd}
                                style={[appStyles.text10, {
                                    borderColor: appColors.white,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    height: 30,
                                    marginEnd: 8,
                                    paddingHorizontal: 15, paddingVertical: 5,
                                    color: appColors.white}]}>{keywords[keyowrd]}</Text>
                        )
                    })
                }
                </ScrollView>
                <View style={[appStyles.rowCenter, {marginTop: 16, flex: 1, justifyContent: 'space-between'}]}>
                    <AirbnbRating
                        isDisabled
                        showRating={false}
                        defaultRating={hotel.rating?Number(hotel.rating):0}
                        size={WIDTH(10)}
                    />
                    <Text style={appStyles.contactUs}>Contact us</Text>
                </View>
            </View>
        </Pressable>
    )
}

export function HotelHozizontalItem({hotel, width}: {hotel: IHotel, width: number}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const keywords = useSelector((state: IRootState)=>state.hotelReducer.keywords)
    const navigation = useNavigation<HotelDetailTabNavigationProp>()
    return (
        <Pressable
            style={{marginHorizontal: 2, width}}
            onPress={()=>navigation.navigate('hotelDetail', {hotel})}>
                <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
                {
                    hotel.pics && hotel.pics.length > 0 &&
                    <Image source={{uri: imageBase+hotel.pics[0]}}
                        style={{
                            borderRadius: 8,
                            // marginHorizontal: 8,
                            width,
                            aspectRatio: 4/3
                        }}
                        resizeMode='stretch'
                    />
                }
                </Shadow>
            <View style={{
                position: 'absolute',
                backgroundColor: appColors.bottomLine,
                borderBottomEndRadius: 6,
                borderBottomStartRadius: 6,
                left: 0, right: 0, bottom: 0,
            }}>
                <View style={[appStyles.rowCenter, {marginTop: 16, marginHorizontal: 16, justifyContent: 'space-between'}]}>
                    <Text style={appStyles.greenBorder}>{hotel.name}</Text>
                    <AirbnbRating
                        isDisabled
                        showRating={false}
                        defaultRating={hotel.rating?Number(hotel.rating):0}
                        size={WIDTH(10)}
                    />
                </View>
                <View style={[appStyles.rowCenter, {marginVertical: 16, marginHorizontal: 16, justifyContent: 'space-between'}]}>
                    <View style={[appStyles.rowCenter, {flex: 3, flexWrap: 'wrap'}]}>
                    {
                        hotel.keywords.map(keyowrd=>{
                            return (
                                <Text
                                    key={keyowrd}
                                    style={[appStyles.text10, {
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        borderWidth: 1,
                                        borderRadius: 15,
                                        marginBottom: 8,
                                        paddingHorizontal: 15,
                                        paddingVertical: 5,
                                        borderColor: appColors.border3,
                                        marginEnd: 8,
                                        color: appColors.white}]}>{keywords[keyowrd]}</Text>
                            )
                        })
                    }
                    </View>
                    <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Text style={appStyles.contactUs}>Contact us</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}
export function HotelHozizontalAdItem({ad, width}: {ad: IAdvertise, width: number}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const navigation = useNavigation<HotelDetailTabNavigationProp>()
    return (
        <View
            style={{marginHorizontal: 8}}>
            <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
            <Image source={{uri: imageBase+ad.pic}}
                style={{
                    borderRadius: 8,
                    // marginHorizontal: 8,
                    width,
                    aspectRatio: 4/3
                }}
                resizeMode='stretch'
            />
            </Shadow>
        </View>
    )
}

export function HotelsHorizontal() {
    const advertises = useSelector((state: IRootState)=>state.advertiseReducer).filter(item=>item.inHotel==1)
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const hotels = useSelector((state: IRootState)=>state.hotelReducer.hotels)
    const navigation = useNavigation<TabNavigationProp>()
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     apiHotels().then(hotels=>{
    //         const adHotels: (IHotel|IAdvertise)[] = hotels
    //         for (const advertise of advertises) {
    //             adHotels.splice(advertise.adIndex, 0, advertise)
    //         }
    //         dispatch(successHotels(adHotels))
    //     })
    // }, [])
    // if (!hotels) {
    //     return null
    // }
    return (
        <View>
            {/* <Swiper
                loop={false}
                style={{
                    height: WIDTH(320)}}>
            {
                hotels.map(hotel=>{
                    return (
                        <HotelHozizontalItem
                            key={hotel.id}
                            hotel={hotel}/>
                    )
                })
            }
            </Swiper> */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                // style={{marginHorizontal: WIDTH(4)}}
                // ItemSeparatorComponent={()=><View style={{width: WIDTH(4)}}/>}
                data={hotels}
                keyExtractor={(item, index)=>index.toString()}
                renderItem={({item, index})=>{
                    const hotel = item as IHotel
                    const ad = item as IAdvertise
                    return (
                        <View style={{marginVertical: 8}}>
                        {
                            ad.inHotel == 1?
                            <HotelHozizontalAdItem ad={ad} width={WIDTH(420)}/>
                            :
                            <HotelHozizontalItem hotel={hotel} width={WIDTH(420)}/>
                        }
                        </View>
                    )
                }}
            />
            {
                hotels && hotels.length > 0 &&
                <Pressable
                    style={{
                        position: 'absolute',
                        left: -10,
                        top: 36,
                    }}
                    onPress={()=>navigation.navigate('hotels')}>
                    <Image source={images.hotels}/>
                </Pressable>
            }
        </View>
    )
}