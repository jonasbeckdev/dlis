import { INews } from 'models'
import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import {FlatList, Text, View} from 'react-native'
import { GradientContainer, NewsHozizontalItem } from 'components'
import { apiHomeNews } from 'modules/api'

export function NewsScreen() {
    const {appStyles} = useDesignScale()
    const [news, setNews] = useState<INews[]>()
    const [refreshing, setRefreshing] = useState(false)
    const loadNews = ()=>{
        apiHomeNews().then(result=>{
            setRefreshing(false)
            setNews(result.featured_news)
        })
    }
    useEffect(()=>{
        loadNews()
    }, [])
    return (
        <GradientContainer>
            <View style={{margin: 16, flex: 1}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={appStyles.menuTitle}>News</Text>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={news}
                    refreshing={refreshing}
                    onRefresh={()=>{
                        setRefreshing(true)
                        loadNews()
                    }}
                    keyExtractor={(item)=>item.id.toString()}
                    ItemSeparatorComponent={()=><View style={{height: 8}}/>}
                    renderItem={({item, index})=>{
                        return (
                            <NewsHozizontalItem news={item}/>
                        )
                    }}
                />
            </View>
        </GradientContainer>
    )
}