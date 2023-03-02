import { GradientListContainer } from 'components'
import { useDesignScale } from 'modules/hooks'
import React from 'react'
import { Image, Text, View } from 'react-native'
import RenderHTML from "react-native-render-html"
import { appColors } from 'assets'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Swiper from 'react-native-swiper'
import { imageBase } from 'modules/constants'
import { NewsDetailTabScreenProp } from './TabScreen'

export function NewsDetailScreen({route}: NewsDetailTabScreenProp) {
    const {news} = route.params
    const {appStyles, WIDTH} = useDesignScale()
    return (
        <GradientListContainer translucentBack>
            <View style={{height: WIDTH(290)}}>
            <Swiper>
            {
                news.news_gallery_image.map((image, index)=>{
                    return (
                        <Image
                            key={index}
                            resizeMode='cover'
                            style={{width: WIDTH(428), height: WIDTH(290)}}
                            source={{uri: imageBase+image}}
                        />
                    )
                })
            }
            </Swiper>
            </View>
            <View style={{flex: 1, margin: 16}}>
                <Text style={appStyles.title24}>{news.news_title}</Text>
                <RenderHTML
                    source={{html: news.news_description}}
                    contentWidth={WIDTH(100)}
                    baseStyle={{...appStyles.text19, color: appColors.black}}
                    />
                <View style={appStyles.rowCenter}>
                    <Ionicons name='time'/>
                    <Text>{moment(news.news_date, 'mm/dd/yyyy').fromNow()}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={appStyles.subTitle14}>Source ANDA</Text>
                </View>
            </View>
        </GradientListContainer>    
    )
}