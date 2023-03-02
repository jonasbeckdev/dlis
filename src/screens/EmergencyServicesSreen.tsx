import { apiAddUserLocation, apiEservices, apiSendLocation } from 'modules/api'
import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, Platform, Pressable, Text, View } from 'react-native'
import { appColors, images } from 'assets'
import { GradientContainer, ModalContainer } from 'components'
import { IEservice } from 'models'
import { imageBase } from 'modules/constants'
import BackgroundService from 'react-native-background-actions'
import LinearGradient from 'react-native-linear-gradient'
import Dialog from "react-native-dialog"
import { openSettings, request, PERMISSIONS } from 'react-native-permissions'
import { handleException } from 'modules/functions'
import Geolocation from 'react-native-geolocation-service'

interface EserviceParam {
    delay: number
    eservice_id: number
}

var currentLocation: Geolocation.GeoCoordinates|null = null
const handleLocation = (delay: number, eservice_id: number, watchId: number)=>{
    console.log('currentLocation:', currentLocation, delay, eservice_id)
    if (currentLocation) {
        apiSendLocation(currentLocation, eservice_id).then(result=>{
            console.log('apiSendLocation:', result)
            if (result.status == 0) {
                Geolocation.clearWatch(watchId)
                BackgroundService.stop()
            } else {
                setTimeout(()=>{
                    handleLocation(delay, eservice_id, watchId)
                }, delay*60000)
            }
        }).catch(()=>{
            setTimeout(()=>{
                handleLocation(delay, eservice_id, watchId)
            }, delay*60000)
        })
    } else {
        setTimeout(()=>{
            handleLocation(delay, eservice_id, watchId)
        }, 10000)
    }
}

export function EmergencyServicesSreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [eservices, setEservices] = useState<IEservice[]>([])
    const [selected, setSelected] = useState<IEservice>()
    const [okModal, setOkModal] = useState(false)
    const [isShowPermissionAlert, setIsShowPermissionAlert] = useState(false)
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
    useEffect(()=>{
        apiEservices().then(eservies=>{
            setEservices(eservies)
        })

    }, [])
    const handlePanic = ()=>{
        requestGPSPermission().then(result=>{
            if (result == 'granted') {
                apiAddUserLocation(selected!.id).then(()=>{
                    BackgroundService.start<EserviceParam>(taskDataArguments=>{
                        const watchId = Geolocation.watchPosition(position=>{
                            console.log('position:', position)
                            const coords = position.coords
                            if (position.coords) {
                                currentLocation = coords
                            }
                        }, error=>{
                            handleException(error)
                        }, {accuracy: {'android': 'high', 'ios': 'best'}})
                        // const unSubscribeLocation = RNLocation.subscribeToLocationUpdates(locations => {
                        //     if (locations && locations.length > 0) {
                        //         const location = locations[0]
                        //         if (location) {
                        //             currentLocation = location
                        //         }
                        //     }
                        // })
                
                        if (taskDataArguments) {
                            const {delay, eservice_id} = taskDataArguments
                            handleLocation(delay>0?delay:10, eservice_id, watchId)
                        }
                        return new Promise((resolve, reject)=>{
                        })
                    }, {
                        taskName: 'Emergency Service',
                        taskTitle: 'Emergency Service',
                        taskDesc: 'Emergency Service Starting...',
                        taskIcon: {name: 'ic_launcher', type: 'mipmap'},
                        parameters: {
                            delay: selected!.resend_time,
                            eservice_id: selected!.id
                        }
                    }).then(()=>{
                        BackgroundService.updateNotification({taskDesc: `Emergency Service Running...`})
                        setSelected(undefined)
                        setTimeout(()=>{
                            setOkModal(true)
                        }, 500)
                    })
                }).catch(exception=>{
                    handleException(exception)
                })
            } else {
                setIsShowPermissionAlert(true)
            }
        }).catch(exception=>{
            handleException(exception)
        })
        // RNLocation.configure({
        //     distanceFilter: 100,
        //     androidProvider: 'auto',
        //     desiredAccuracy: {
        //         ios: 'best',
        //         android: 'highAccuracy'
        //     },
        //     interval: 10000,
        //     fastestInterval: 5000
        // })
        // RNLocation.requestPermission({
        //     ios: "whenInUse",
        //     android: {
        //         detail: 'fine'
        //     },
        // }).then(granted => {
        //     if (granted) {
        //         apiAddUserLocation(selected!.id).then(()=>{
        //             BackgroundService.start<EserviceParam>(taskDataArguments=>{
        //                 // const unSubscribeLocation = RNLocation.subscribeToLocationUpdates(locations => {
        //                 //     if (locations && locations.length > 0) {
        //                 //         const location = locations[0]
        //                 //         if (location) {
        //                 //             currentLocation = location
        //                 //         }
        //                 //     }
        //                 // })
                
        //                 if (taskDataArguments) {
        //                     const {delay, eservice_id} = taskDataArguments
        //                     handleLocation(delay>0?delay:10, eservice_id, unSubscribeLocation)
        //                 }
        //                 return new Promise((resolve, reject)=>{
        //                 })
        //             }, {
        //                 taskName: 'Emergency Service',
        //                 taskTitle: 'Emergency Service',
        //                 taskDesc: 'Emergency Service Starting...',
        //                 taskIcon: {name: 'ic_launcher', type: 'mipmap'},
        //                 parameters: {
        //                     delay: selected!.resend_time,
        //                     eservice_id: selected!.id
        //                 }
        //             }).then(()=>{
        //                 // BackgroundService.updateNotification({taskDesc: `Emergency Service Running...`})
        //                 setSelected(undefined)
        //                 setTimeout(()=>{
        //                     setOkModal(true)
        //                 }, 500)
        //             })
        //         }).catch(exception=>{
        //             handleException(exception)
        //         })
        //     } else {
        //         setIsShowPermissionAlert(true)
        //     }
        // })
    }
    return (
        <GradientContainer>
            <View style={{flex: 1, margin: 8}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Emergency Services</Text>
                </View>
                <FlatList
                    style={{flex: 1, marginTop: HEIGHT(100)}}
                    data={eservices}
                    keyExtractor={({id})=>id.toString()}
                    // contentContainerStyle={{alignItems: 'center'}}
                    numColumns={2}
                    renderItem={({item, index})=>{
                        return (
                            <Pressable
                                style={{
                                    marginTop: 8,
                                    marginStart: index%2!=0?WIDTH(8):0
                                }}
                                onPress={()=>setSelected(item)}>
                                <LinearGradient
                                    style={[appStyles.rowCenter, {
                                        borderWidth: 1,
                                        borderColor: appColors.blue,
                                        borderRadius: 8,
                                        shadowColor: 'black',
                                        shadowRadius: 10,
                                        // shadowOffset: { width: 4, height: 0 },
                                        // elevation: 5,
                                        width: WIDTH(196), height: WIDTH(100)}]}
                                    colors={[appColors.background, appColors.lightPurple]}>
                                    <Image source={{uri: imageBase+item.pic}} style={[appStyles.circleItemImage, {marginStart: 16}]} />
                                    <Text style={{marginStart: 16}}>{item.name}</Text>
                                </LinearGradient>
                            </Pressable>
                        )
                    }}
                />
                <ModalContainer
                    title='Police Service'
                    backdropOpacity={0}
                    image={images.redBall}
                    onBackdropPress={()=>setSelected(undefined)}
                    isVisible={selected?true:false}>
                    <View style={{alignItems: 'center'}}>
                        <View style={{
                            marginTop: 16,
                            flexDirection: 'row',
                            borderEndColor: appColors.black
                        }}>
                            <View style={{
                                borderStartColor: appColors.black,
                                borderStartWidth: 2,
                                paddingStart: 16
                            }}>
                                <Text>Tell free</Text>
                                <Text style={{marginTop: 8, color: appColors.black}}>911</Text>
                            </View>
                            <View style={{width: 16}}/>
                            <View style={{
                                borderEndColor: appColors.black,
                                borderEndWidth: 2,
                                paddingEnd: 16}}>
                                <Text>Phone</Text>
                                <Text style={{marginTop: 8, color: appColors.black}}>{selected?.number}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={{marginTop: 32, marginBottom: 16}}
                            onPress={handlePanic}>
                            <Image style={appStyles.panicButton} source={images.panicButton}/>
                        </Pressable>
                    </View>
                </ModalContainer>
                <ModalContainer
                    isVisible={okModal}
                    backdropOpacity={0}
                    image={images.redBall}
                    title='Police Service'>
                    <View style={{alignItems: 'center'}}>
                        <View style={{
                            margin: 16,
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            borderStartWidth: 2, borderEndWidth: 2,
                            borderEndColor: appColors.black}}>
                            <Text style={appStyles.montserrat}>PLEASE STAY CLAM</Text>
                            <Text style={[appStyles.montserrat, {marginTop: 16}]}>HELP IS ON THE WAY</Text>
                        </View>
                        <Pressable
                            style={{marginTop: 32, marginBottom: 16}}
                            onPress={()=>setOkModal(false)}>
                            <Image style={appStyles.panicButton} source={images.panicOk}/>
                        </Pressable>
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