import React, { useEffect, useState } from 'react'
import { GradientListContainer, HotelHozizontalAdItem, HotelHozizontalItem, HotelSmalHeightItem, StyledInput } from 'components'
import { Keyboard, Text, View } from 'react-native'
import { useDesignScale } from 'modules/hooks'
import { IAdvertise, IHotel } from 'models'
import { apiHotels, apiSearchHotels } from 'modules/api'
import Swiper from 'react-native-swiper'
import { appColors } from 'assets'
import Feather from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'

export function HotelsScreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const hotels = useSelector((state: IRootState)=>state.hotelReducer.hotels)
    const [searchHotels, setSearchHotels] = useState<IHotel[]>()
    const [name, setName] = useState('')
    const handleSearch = ()=>{
        if (name) {
            Keyboard.dismiss()
            apiSearchHotels(name).then(result=>{
                setSearchHotels(result)
            })
        }
    }
    return (
        <GradientListContainer>
            <View style={{
                flex: 1, marginTop: 16}}>
                <View style={{alignItems: 'flex-end', marginTop: 16}}>
                    <Text style={[appStyles.menuTitle, {marginEnd: 16}]}>Hotels</Text>
                </View>
                {
                    hotels &&
                    <View style={{
                        marginTop: 16,
                        height: WIDTH(340)
                    }}>
                    <Swiper
                        loop={false}
                        paginationStyle={{
                            bottom: 0
                        }}
                        style={{
                            borderWidth: 1, borderColor: 'red',
                        }}>
                        {
                            hotels.map(item=>{
                                const hotel = item as IHotel
                                const ad = item as IAdvertise
                                if (ad.inHotel == 1) {
                                    return <HotelHozizontalAdItem ad={ad} width={WIDTH(412)}/>
                                }
                                return (
                                    <HotelHozizontalItem width={WIDTH(412)} key={hotel.id} hotel={hotel}/>
                                )
                            })
                        }
                    </Swiper>
                    </View>
                }
                <View style={{margin: 16}}>
                    <StyledInput
                        onEndEditing={()=>{
                            handleSearch()
                        }}
                        onChangeText={setName}
                        style={{paddingEnd: 50}} placeholder='Search Hotels'/>
                    <View style={{position: 'absolute', top: 0, bottom: 0, right: 16, justifyContent: 'center'}}>
                        <Feather
                            onPress={()=>{
                                if (!name) {
                                    return
                                }
                                handleSearch()
                            }}
                            name='search' size={16} color={appColors.black}/>
                    </View>
                </View>
                <View style={{flex: 1}}>
                {
                    searchHotels?.map(hotel=>{
                        return (
                            <View
                                key={hotel.id}
                                style={{marginBottom: 8}}>
                                <HotelSmalHeightItem
                                    width={WIDTH(412)}
                                    hotel={hotel}/>
                            </View>
                        )
                    })
                }
                </View>
            </View>
            </GradientListContainer>
    )
}