import React from 'react'
import { Image, Text, View } from 'react-native'
import { GradientListContainer } from 'components'
import { useDesignScale } from 'modules/hooks'
import Swiper from 'react-native-swiper'
import { imageBase } from 'modules/constants'
import { appColors } from 'assets'
import RenderHTML from "react-native-render-html"
import { TourDetailTabScreenProp } from './TabScreen'

export function TourDetailScreen({route}: TourDetailTabScreenProp) {
    const {tour} = route.params
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    return (
        <GradientListContainer>
            <View style={{flex: 1, margin: 16}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={appStyles.menuTitle}>Tourism</Text>
                </View>
                <Text style={[appStyles.greenBorder, {alignSelf: 'center'}]}>{tour.name}</Text>
                {
                    tour.pics &&
                    <View style={{height: WIDTH(330), marginTop: 16}}>
                    <Swiper
                        paginationStyle={{
                            bottom: 0
                        }}
                        >
                    {
                        tour.pics.map((pic, index)=>{
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
                    </View>
                }
                {
                    tour.description ?
                    <View style={{margin: 16}}>
                        <RenderHTML
                            source={{html: tour.description}}
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