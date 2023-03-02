import { FlatList, Image, Pressable, Text, View } from "react-native";
import { IAdvertise, INews } from "models";
import React, { useEffect, useState } from "react";
import { useDesignScale } from "modules/hooks";
import { apiHomeNews } from "modules/api";
import { appColors, images } from "assets";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NewsDetailTabNavigationProp, TabNavigationProp } from "screens"
import Swiper from 'react-native-swiper'
import { Shadow } from "react-native-shadow-2";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "reduxsaga/reducers";
import { imageBase } from "modules/constants"
import {successNews} from 'reduxsaga/actions'

export function NewsHozizontalItem({news}: {news: INews}) {
    const navigation = useNavigation<NewsDetailTabNavigationProp>()
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const handleNews = ()=>{
        navigation.navigate('newsDetail', {news})
    }
    return (
        <View style={{alignItems: 'center'}}>
        <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
        <View>
            <Image source={{uri: imageBase+news.news_image}}
                style={{
                    resizeMode: 'stretch',
                    width: WIDTH(428), height: WIDTH(290)}}
            />
            <Pressable onPress={handleNews}>
                <Image
                    source={images.readMore}
                    style={{
                        position: 'absolute',
                        right: 40,
                        bottom: 10,
                        width: 74, height: 26
                    }}
                />
            </Pressable>
            <View style={[
                appStyles.absolute,
                {
                    // borderWidth: 5,
                    // borderColor: 'red',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    bottom: 60, left: 26, right: 26}
            ]}>
                <Text style={[appStyles.text10, {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderColor: appColors.greenBorder,
                    color: appColors.white}]}>{news.news_title}</Text>
            </View>
        </View>
        </Shadow>
        </View>
    )
}

export function NewsHozizontalAdItem({news}: {news: IAdvertise}) {
    const navigation = useNavigation<NewsDetailTabNavigationProp>()
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const handleNews = ()=>{
        // navigation.navigate('newsDetail', {news})
    }
    return (
        <Shadow corners={['bottomRight']} distance={5} radius={4} sides={['bottom', 'right']}>
        <View
            style={{
                shadowColor: "red",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,
                elevation: 2,
            }}
        >
            <Image
                resizeMode='stretch'
                source={{uri: imageBase+news.pic}}
                style={{width: WIDTH(428), height: WIDTH(290)}}
            />
            {/* <Pressable onPress={handleNews}>
                <Image
                    source={images.readMore}
                    style={{
                        position: 'absolute',
                        right: 40,
                        bottom: 10,
                        width: 74, height: 26
                    }}
                />
            </Pressable>
            <Text style={[appStyles.text10, {
                position: 'absolute',
                bottom: 60,
                left: 26,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderColor: appColors.greenBorder,
                color: appColors.white}]}>{news.news_title}</Text> */}
        </View>
        </Shadow>
    )
}

export function NewsHorizontal() {
    // const [news, setNews] = useState<(INews|IAdvertise)[]>()
    const navigation = useNavigation<TabNavigationProp>()
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const advertises = useSelector((state: IRootState)=>state.advertiseReducer).filter(item=>item.inNews==1)
    const news = useSelector((state: IRootState)=>state.newsReducer.news)
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     apiHomeNews().then(result=>{
    //         const adNews: (INews|IAdvertise)[] = result.featured_news
    //         for (const advertise of advertises) {
    //             adNews.splice(advertise.adIndex, 0, advertise)
    //         }
    //         dispatch(successNews(adNews))
    //     })
    // }, [])
    return (
        <View>
            {
                news && news.length > 0 &&
                <View style={{height: WIDTH(290)}}>
                <Swiper autoplay>
                {
                    news.map(item=>{
                        const ad = item as IAdvertise
                        const news = item as INews
                        if (ad.inNews == 1) {
                            return (
                                <NewsHozizontalAdItem key={item.id} news={ad}/>
                            )
                        }
                        return (
                            <NewsHozizontalItem key={item.id} news={news}/>
                        )
                    })
                }
                </Swiper>
                </View>
            }
            {/* <FlatList
                data={news}
                horizontal
                keyExtractor={(item)=>item.id.toString()}
                renderItem={({item, index})=>{
                    return (
                        <NewsHozizontalItem news={item}/>
                    )
                }}
            /> */}
            {
                news && news.length > 0 &&
                <Pressable
                    style={{
                        position: 'absolute',
                        left: -10,
                        top: 36,
                    }}
                    onPress={()=>navigation.navigate('news')}>
                    <Image
                        source={images.news}
                    />
                </Pressable>
            }
        </View>
    )
}