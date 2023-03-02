import React from 'react'
import { GradientListContainer } from 'components'
import { Image, Text, View } from 'react-native'
import { useDesignScale } from 'modules/hooks'
import Swiper from 'react-native-swiper'
import { imageBase } from 'modules/constants'
import { appColors } from '../assets/colors'
import { AirbnbRating } from 'react-native-ratings'
import RenderHTML from "react-native-render-html"
import { HotelDetailTabScreenProp } from './TabScreen'

export function HotelDetailScreen({navigation, route}: HotelDetailTabScreenProp) {
    const {hotel} = route.params
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    return (
        <GradientListContainer>
            <View style={{margin: 8}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Hotels</Text>
                </View>
                <View style={appStyles.center}>
                    <Text style={appStyles.greenBorder}>{hotel.name}</Text>
                </View>
                {
                    hotel.pics &&
                    <Swiper
                        paginationStyle={{
                            bottom: 0
                        }}
                        style={{
                            height: WIDTH(330),
                            marginTop: 8}}
                        >
                    {
                        hotel.pics.map((pic, index)=>{
                            return (
                                <Image
                                    key={index.toString()}
                                    source={{uri: imageBase+pic}}
                                    style={{
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor: appColors.white,
                                        width: WIDTH(410),
                                        height: WIDTH(300)}}
                                    resizeMode='stretch'
                                />
                            )
                        })
                    }
                    </Swiper>
                }
                <View style={{alignItems: 'flex-end'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text>Rating</Text>
                        <View style={appStyles.rowCenter}>
                            <AirbnbRating
                                isDisabled
                                showRating={false}
                                defaultRating={hotel.rating?Number(hotel.rating):0}
                                size={WIDTH(10)}
                            />
                            <Text style={{marginStart: 8}}>{hotel.rating??0}/5</Text>
                        </View>
                    </View>
                </View>
                {
                    hotel.amenities ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>Amenities</Text>
                        <RenderHTML
                            source={{html: hotel.amenities}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.rooms &&
                    <View>
                    <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>Rooms</Text>
                    <Swiper
                        paginationStyle={{
                            bottom: 0
                        }}
                        style={{
                            height: WIDTH(330),
                            marginTop: 8}}
                        >
                    {
                        hotel.rooms.map((room, index)=>{
                            return (
                                <Image
                                    key={index.toString()}
                                    source={{uri: imageBase+room}}
                                    style={{
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor: appColors.white,
                                        width: WIDTH(410),
                                        height: WIDTH(300)}}
                                    resizeMode='stretch'
                                />
                            )
                        })
                    }
                    </Swiper>
                    </View>
                }
                {
                    hotel.policies ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>Policies</Text>
                        <RenderHTML
                            source={{html: hotel.policies}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.nearby ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>What's nearby</Text>
                        <RenderHTML
                            source={{html: hotel.nearby}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.around ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>Getting around</Text>
                        <RenderHTML
                            source={{html: hotel.around}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.restaurants ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>Restaurants</Text>
                        <RenderHTML
                            source={{html: hotel.restaurants}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.property1 ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>About this property</Text>
                        <RenderHTML
                            source={{html: hotel.property1}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
                {
                    hotel.property2 ?
                    <View style={{marginVertical: 8}}>
                        <Text style={[appStyles.contactUs, {alignSelf: 'flex-start'}]}>About this property</Text>
                        <RenderHTML
                            source={{html: hotel.property2}}
                            contentWidth={WIDTH(100)}
                            baseStyle={appStyles.text12}
                            />
                    </View>
                    :<View/>
                }
            </View>
        </GradientListContainer>
    )
}