import React, { useEffect, useRef, useState } from 'react'
import {FlatList, Image, Platform, Pressable, Text, TextInput, View} from 'react-native'
import { GradientContainer, ModalContainer, StyledButton, StyledRoundButton } from 'components'
import { useDesignScale } from 'modules/hooks'
import { appColors, images } from 'assets'
import { apiComplains, apiCompTypes, apiNewComplain } from 'modules/api'
import { IComplaint, ICompType } from 'models'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment-timezone'
import Modal from 'react-native-modal'
import { handleException } from 'modules/functions'
import DropDownPicker from 'react-native-dropdown-picker'
import ToggleSwitch from 'toggle-switch-react-native'
import Dialog from "react-native-dialog"
import { Hoshi } from 'react-native-textinput-effects'
import Geolocation from 'react-native-geolocation-service'
import { openSettings, request, PERMISSIONS } from 'react-native-permissions'
import { useFocusEffect } from "@react-navigation/native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImageCropPicker, {Image as CropImage} from 'react-native-image-crop-picker'
import { imageBase } from 'modules/constants'

export function ComplainsScreen() {
    const [visible, setVisible] = useState(false)
    const [complainSent, setComplainSent] = useState(false)
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const [compTypes, setCompTypes] = useState<ICompType[]>([])
    const [complains, setComplains] = useState<IComplaint[]>()
    const [loading, setLoading] = useState(false)
    const [openTypes, setOpenTypes] = useState(false)
    const [comp_type_id, setComp_type_id] = useState<number|null>(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [complain, setComplain] = useState('')
    const [complaintImage, setComplaintImage] = useState<CropImage>()
    const [gpsLocation, setGpsLocation] = useState(false)
    const [isShowPermissionAlert, setIsShowPermissionAlert] = useState(false)
    const currentLocation = useRef<Geolocation.GeoCoordinates>()
    const unSubscribeLocation = useRef<any>(null)
    const [selected, setSelected] = useState<IComplaint>()
    const watchId = useRef<number>()
    const requestGPSPermission = ()=>{
        return new Promise((resolve, reject)=>{
            if (Platform.OS == 'ios') {
                Geolocation.requestAuthorization('whenInUse').then(result=>resolve(result)).catch(exception=>reject(exception))
            } else if (Platform.OS == 'android') {
                resolve(request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION))
            } else {
                resolve('granted')
            }
        })
    }
    const loadComplains = ()=>{
        apiComplains().then(result=>{
            console.log('apiComplains:', result)
            setComplains(result)
        })
    }
    const loadCompTypes = ()=>{
        apiCompTypes().then(result=>{
            setCompTypes(result)
        })
    }
    useEffect(()=>{
        loadComplains()
        loadCompTypes()
    }, [])


    useEffect(()=>{
        if (gpsLocation) {
            requestGPSPermission().then(result=>{
                if (result == 'granted') {
                    watchId.current = Geolocation.watchPosition(position=>{
                        console.log('position:', position)
                        const coords = position.coords
                        if (position.coords) {
                            currentLocation.current = coords
                        }
                    }, error=>{
                        handleException(error)
                    }, {accuracy: {'android': 'high', 'ios': 'best'}})

                } else {
                    setIsShowPermissionAlert(true)
                }
            }).catch(exception=>{
                handleException(exception)
            })
            return ()=>{
                if (watchId.current) {
                    Geolocation.clearWatch(watchId.current)
                }
            }
        } else {
            if (unSubscribeLocation.current) {
                unSubscribeLocation.current()
            }
            unSubscribeLocation.current = null
        }
    }, [gpsLocation])
    return (
        <GradientContainer>
            <View style={{flex: 1, marginVertical: 16, marginHorizontal: 8}}>
                <View style={[appStyles.rowCenter, {justifyContent: 'flex-end'}]}>
                    <Image source={images.complain} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30), marginEnd: 8}}/>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Complain</Text>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={complains}
                    keyExtractor={item=>item.id.toString()}
                    renderItem={({item})=>{
                        return (
                            <Pressable onPress={()=>setSelected(item)}>
                                <LinearGradient
                                    style={{
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderBottomWidth: 2,
                                        marginTop: 8,
                                        padding: 8,
                                        borderColor: appColors.blue,
                                    }}
                                    colors={[appColors.background, appColors.lightPurple]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        }}>
                                        <Image source={images.house} resizeMode='contain' style={{width: WIDTH(60), height: WIDTH(60), borderRadius: WIDTH(30)}} />
                                        <View style={{flex: 4, marginStart: 16}}>
                                            <Text>{item.name}</Text>
                                        </View>
                                        <View style={[appStyles.rowCenter, {flex: 2}]}>
                                            {
                                                item.resolved==1?
                                                <Image source={images.resolved} style={{width: WIDTH(15), aspectRatio: 1}}/>
                                                :<Image source={images.notResolved} style={{width: WIDTH(15), aspectRatio: 1}}/>
                                            }
                                            <Text style={{flex: 1, marginStart: 8}}>{moment.tz(item.time, 'America/New_York').fromNow(true)}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        )
                    }}
                    />
                <View style={appStyles.center}>
                    <StyledButton title='New Complain' enabled onPress={()=>{
                        loadCompTypes()
                        setVisible(true)
                    }}/>
                </View>
                <ModalContainer
                    title='Complain Sent'
                    isVisible={complainSent}>
                    <View style={{alignItems: 'center', margin: 16}}>
                        <Text style={{textAlign: 'center'}}>Thank you for taking the time to{`\n`} send your complain.</Text>
                        <StyledRoundButton
                            style={{marginTop: 80}}
                            title='Close'
                            enabled
                            onPress={()=>{
                                setComplainSent(false)
                                loadComplains()
                            }}
                        />
                    </View>
                </ModalContainer>
                <ModalContainer
                    title='Complain'
                    isVisible={selected?true:false}>
                    <View style={{marginHorizontal: 16}}>
                        <View style={appStyles.borderStart}>
                            <Text style={appStyles.greyText12}>Title</Text>
                            <Text style={appStyles.text14}>{selected?.name}</Text>
                        </View>
                        <View style={appStyles.borderStart}>
                            <Text style={appStyles.greyText12}>Complain Type</Text>
                            <Text style={appStyles.text14}>{selected?.comp_type}</Text>
                        </View>
                        <View style={appStyles.borderStart}>
                            <Text style={appStyles.greyText12}>Your Complain</Text>
                            <Text style={appStyles.text14}>{selected?.complain}</Text>
                            {selected?.news_image && <Image style={{marginTop: 8, width: 100, height: 100, resizeMode: 'contain'}} source={{uri: imageBase+selected.news_image}}/>}
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 16}}>
                        <StyledRoundButton
                            style={{marginTop: 16}}
                            title='Close'
                            enabled
                            onPress={()=>{
                                setSelected(undefined)
                            }}
                        />
                    </View>
                </ModalContainer>
                <ModalContainer
                    title='New Complain'
                    onBackdropPress={()=>setVisible(false)}
                    isVisible={visible}>
                    <View style={{alignItems: 'center', marginVertical: 16}}>
                        <Hoshi
                            value={name}
                            inputStyle={appStyles.hosiInput}
                            labelStyle={appStyles.hosiLabel}
                            borderColor={appColors.grey}
                            onChangeText={setName}
                            label='Title' style={appStyles.hoshi}/>
                        <DropDownPicker
                            items={compTypes?.map(item=>{
                                return {
                                    label: item.name,
                                    value: item.id
                                }
                            })}
                            placeholder='Complain Type'
                            placeholderStyle={{color: appColors.grey}}
                            listMode='SCROLLVIEW'
                            open={openTypes}
                            setOpen={setOpenTypes}
                            style={{
                                height: WIDTH(65),
                                paddingStart: 20,
                                width: WIDTH(327),
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                borderBottomWidth: 1
                            }}
                            containerStyle={{width: WIDTH(327)}}
                            value={comp_type_id}
                            setValue={setComp_type_id}
                                    />
                        <Hoshi
                            value={phone}
                            inputStyle={appStyles.hosiInput}
                            labelStyle={appStyles.hosiLabel}
                            borderColor={appColors.grey}
                            onChangeText={setPhone}
                            keyboardType='phone-pad'
                            label='Contact Number' style={appStyles.hoshi}/>
                        <View>
                            <Hoshi
                                value={complain}
                                inputStyle={[appStyles.hosiInput, {paddingRight: 100}]}
                                labelStyle={appStyles.hosiLabel}
                                borderColor={appColors.grey}
                                onChangeText={setComplain}
                                label='Your complain' style={appStyles.hoshi}/>
                            <View style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', right: 0, top: 0, bottom: 0, justifyContent: 'center'}}>
                                <Ionicons
                                    onPress={()=>{
                                        ImageCropPicker.openPicker({
                                            mediaType: 'photo',
                                            cropping: true
                                        }).then(image=>setComplaintImage(image))
                                    }}
                                    size={32} name='image'/>
                                <Ionicons
                                    style={{marginStart: 4}}
                                    onPress={()=>{
                                        ImageCropPicker.openCamera({
                                            mediaType: 'photo',
                                            cropping: true
                                        }).then(image=>setComplaintImage(image))
                                    }}
                                    size={32} name='camera'/>
                            </View>
                        </View>
                        {
                            complaintImage &&
                            <View style={{marginTop: 8}}>
                                <Image source={{uri: complaintImage.path}} style={{width: 100, height: 100, resizeMode: 'contain'}}/>
                                <View style={[appStyles.absolute, {}]}>
                                    <Ionicons
                                        onPress={()=>setComplaintImage(undefined)}
                                        name='close-circle' size={32}/>
                                </View>
                            </View>
                        }
                        {/* <FlatList
                            style={{marginHorizontal: 16}}
                            horizontal
                            data={[images.Grabber, images.complain, images.completed, images.floatingButton]}
                            renderItem={({item})=>{
                                return (
                                    <View>
                                        <Image source={item} style={{width: 100, height: 100, resizeMode: 'contain'}}/>
                                        <View style={[appStyles.absolute, {}]}>
                                            <Ionicons name='close-circle' size={32}/>
                                        </View>
                                    </View>
                                )
                            }}
                            /> */}
                        <View style={{marginTop: 16}}>
                            <ToggleSwitch
                                label='GPS Location'
                                isOn={gpsLocation}
                                onToggle={setGpsLocation}
                                labelStyle={[appStyles.text16, {color: appColors.black}]}
                            />
                        </View>
                        <StyledRoundButton
                            loading={loading}
                            enabled={name&&phone&&comp_type_id&&complain?true:false}
                            style={{marginTop: 8}} title='Submit' onPress={()=>{
                                setLoading(true)
                                apiNewComplain({
                                    name,
                                    comp_type_id: comp_type_id!,
                                    phone,
                                    complaintImage,
                                    latitude: currentLocation.current?.latitude,
                                    longitude:currentLocation.current?.longitude,
                                    complain})
                                .then(()=>{
                                    setLoading(false)
                                    setVisible(false)
                                    setComp_type_id(null)
                                    setName('')
                                    setPhone('')
                                    setComplain('')
                                    setTimeout(()=>{
                                        setComplainSent(true)
                                    }, 1000)
                                }).catch(exception=>{
                                    setLoading(false)
                                    handleException(exception)
                                })
                            }}/>
                    </View>
                </ModalContainer>
                <Dialog.Container visible={isShowPermissionAlert}>
                <Dialog.Title>Permission Reqest</Dialog.Title>
                <Dialog.Description>
                    Please accept location permission
                </Dialog.Description>
                <Dialog.Button label="Cancel"
                    onPress={()=>{
                        setIsShowPermissionAlert(false)
                    }}
                />
                <Dialog.Button label="Setting"
                    onPress={()=>openSettings()}
                />
                </Dialog.Container>
             </View>
        </GradientContainer>
    )
}