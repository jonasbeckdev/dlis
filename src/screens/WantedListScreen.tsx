import { appColors, images } from 'assets'
import { GradientListContainer } from 'components'
import { apiWantedLists } from 'modules/api'
import { imageBase } from 'modules/constants'
import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { IWantedList } from 'models'
import Modal from 'react-native-modal'

export function WantedListScreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [wlists, setWlists] = useState<IWantedList[]>([])
    const [selected, setSelected] = useState<IWantedList>()
    useEffect(()=>{
        apiWantedLists().then(wlists=>{
            setWlists(wlists)
        })
    }, [])
    return (
        <GradientListContainer>
            <View
                style={{flex: 1, margin: 16}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={appStyles.menuTitle}>Wanted List</Text>
                </View>
                {
                    wlists.map(item=>{
                        return (
                            <Pressable
                                key={item.id}
                                onPress={()=>setSelected(item)}>
                            <LinearGradient
                                style={[appStyles.rowCenter, {
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginTop: 8,
                                    borderColor: appColors.blue,
                                }]}
                                colors={[appColors.background, appColors.lightPurple]}
                            >
                                <Image source={{uri: imageBase+item.pic}} resizeMode='contain' style={[appStyles.circleItemImage, {marginStart: 16}]} />
                                <View style={{alignItems: 'center', flex: 1, margin: 8}}>
                                    <Text>{item.title}</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between'}}>
                                        <View>
                                            <Text>{item.name}</Text>
                                            <Text>{item.aged}years</Text>
                                            <Text>{item.lastSeen}</Text>
                                        </View>
                                        <Text>${item.price}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                            </Pressable>
                        )
                    })
                }
                <Modal
                    backdropOpacity={0}
                    isVisible={selected?true:false}>
                    <View style={{
                        height: HEIGHT(800),
                        alignSelf: 'center',
                        backgroundColor: appColors.white,
                        borderWidth: 1,
                        borderColor: appColors.grey,
                        borderRadius: 16,
                        flex: 1}}>
                        <Image
                            style={{
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                width: WIDTH(400), height: WIDTH(250)}}
                            source={{uri: imageBase+selected?.pic}}/>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{margin: 16, flex: 1}}>
                            <View style={[appStyles.absolute, appStyles.center]}>
                                <Image source={images.issued}/>
                            </View>
                            <View style={appStyles.center}>
                                <Text style={appStyles.blueTitle25}>{selected?.name}</Text>
                            </View>
                            <View style={[appStyles.rowCenter, {marginTop: 16, justifyContent: 'space-between'}]}>
                                <View>
                                    <Text>Alias</Text>
                                    <Text style={{color: appColors.black}}>{selected?.alias}</Text>
                                </View>
                                <View>
                                    <Text>Aged</Text>
                                    <Text style={{color: appColors.black}}>{selected?.aged}</Text>
                                </View>
                                <View>
                                    <Text>Height</Text>
                                    <Text style={{color: appColors.black}}>{selected?.height}</Text>
                                </View>
                                <View>
                                    <Text>Hair</Text>
                                    <Text style={{color: appColors.black}}>{selected?.hair}</Text>
                                </View>
                            </View>
                            <View style={[appStyles.rowCenter, {marginTop: 16, justifyContent: 'space-between'}]}>
                                <View>
                                    <Text>Complexion</Text>
                                    <Text style={{color: appColors.black}}>{selected?.complexion}</Text>
                                </View>
                                <View>
                                    <Text>Built</Text>
                                    <Text style={{color: appColors.black}}>{selected?.built}</Text>
                                </View>
                                <View>
                                    <Text>Eyes</Text>
                                    <Text style={{color: appColors.black}}>{selected?.eyes}</Text>
                                </View>
                                <View>
                                    <Text>Ears</Text>
                                    <Text style={{color: appColors.black}}>{selected?.ears}</Text>
                                </View>
                            </View>
                            <View style={[appStyles.rowCenter, {marginTop: 16, justifyContent: 'space-between'}]}>
                                <View>
                                    <Text>Dress in which last seen</Text>
                                    <Text style={{color: appColors.black}}>{selected?.dressInSuit}</Text>
                                </View>
                                <View>
                                    <Text>Last Seen</Text>
                                    <Text style={{color: appColors.black}}>{selected?.lastSeen}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 16}}>
                                <Text>Occupation</Text>
                                <Text style={{color: appColors.black}}>{selected?.occupation}</Text>
                            </View>
                            <View style={{marginTop: 16}}>
                                <Text>Maybe Found</Text>
                                <Text style={{color: appColors.black}}>{selected?.mybeFound}</Text>
                            </View>
                            <View style={[appStyles.rowCenter, {marginTop: 16, justifyContent: 'space-between'}]}>
                                <View>
                                    <Text>Warrant No</Text>
                                    <Text style={{color: appColors.black}}>{selected?.warrantNo}</Text>
                                </View>
                                <View>
                                    <Text>Issued By</Text>
                                    <Text style={{color: appColors.black}}>{selected?.issuedBy}</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <Pressable
                            style={{position: 'absolute', top: 8, right: 8}}
                            onPress={()=>{
                                setSelected(undefined)
                        }}>
                            <Image
                                source={images.close}/>
                        </Pressable>
                    </View>
                </Modal>
             </View>
       </GradientListContainer>
    )
}