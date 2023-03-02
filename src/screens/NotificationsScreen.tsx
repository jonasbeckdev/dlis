import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { GradientContainer, ModalContainer, StyledButton } from "components";
import { useDesignScale } from "modules/hooks";
import { appColors, images } from "assets";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "reduxsaga/reducers";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { INotification } from "models";
import Modal from 'react-native-modal'
import { removeNotification } from "reduxsaga/actions";

export function NotificationsScreen() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const notifications = useSelector((state: IRootState)=>state.notificationReducer)
    const [selected, setSelected] = useState<INotification>()
    const notificationRef = useRef<FlatList>(null)
    const dispatch = useDispatch()
    useEffect(()=>{
        notificationRef.current?.scrollToOffset({offset: 0, animated: false})
    }, [notifications])
    return (
        <GradientContainer>
            <View style={{flex: 1, marginVertical: 16, marginHorizontal: 8}}>
                <View style={[appStyles.rowCenter, {justifyContent: 'flex-end'}]}>
                    <Image source={images.bell} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30), marginEnd: 8}}/>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Notifications</Text>
                </View>
                <FlatList
                    data={notifications}
                    ref={notificationRef}
                    keyExtractor={item=>item.notificationId.toString()}
                    renderItem={({item, index})=>{
                        return (
                            <Pressable onPress={()=>setSelected(item)}>
                                <LinearGradient
                                    style={{
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        marginTop: 8,
                                        padding: 8,
                                        borderColor: appColors.blue,
                                    }}
                                    colors={[appColors.background, appColors.lightPurple]}>
                                    <View style={appStyles.rowCenter}>
                                        <View style={{width: 60}}>
                                            {
                                                item.bigPicture && <Image source={{uri: item.bigPicture}} style={{width: 60, height: 60}}/>
                                            }
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={[appStyles.text16, {textAlign: 'center', color: appColors.black}]}>{item.title}</Text>
                                            <Text style={[appStyles.text14, {textAlign: 'center', color: appColors.black}]}>{item.body}</Text>
                                            <Text style={{alignSelf: 'flex-end'}}>
                                                {moment(item.date).fromNow()}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                dispatch(removeNotification(index))
                                            }}>
                                        <Image source={images.close}/>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        )
                    }}
                />
                <ModalContainer
                    title={selected?.title??''}
                    isVisible={selected?true:false}>
                    <View style={{flexDirection: 'row', marginTop: 16, marginHorizontal: 16}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={appStyles.title20}>{selected?.body}</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 16}}>
                        <StyledButton
                            style={{marginTop: 16}}
                            title='Close'
                            enabled
                            onPress={()=>{
                                setSelected(undefined)
                            }}
                        />
                    </View>
                </ModalContainer>
            </View>
        </GradientContainer>
    )
}