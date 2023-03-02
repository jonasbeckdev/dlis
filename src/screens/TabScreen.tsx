import React, { useEffect, useState } from 'react'
import { GradientListContainer } from "components"
import { createBottomTabNavigator, BottomTabNavigationProp, BottomTabScreenProps, BottomTabBar } from '@react-navigation/bottom-tabs'
import { PanicScreen } from './PanicScreen'
import { NotificationsScreen } from './NotificationsScreen'
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { appColors, images } from 'assets'
import { useDesignScale } from 'modules/hooks'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { EmergencyServicesSreen } from './EmergencyServicesSreen'
import { WantedListScreen } from './WantedListScreen'
import { JobsScreen } from './JobsScreen'
import { ProjectsScreen } from './ProjectsScreen'
import { HotelsScreen } from './HotelsScreen'
import { TourismScreen } from './TourismScreen'
import { PropertyRateScreen } from './PropertyRateScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NewsScreen } from './NewsScreen'
import { ComplainsScreen } from './ComplainsScreen'
import { PermitScreen } from './PermitScreen'
import { FlagshipsScrees } from './FlagshipsScrees'
import { ProfileScreen } from './ProfileScreen'
import { useDispatch } from 'react-redux'
import { addNotification, clearProfile, readNotification } from 'reduxsaga/actions'
import { LoggedInStackNavigationProps } from './stackNavigator'
import Modal from 'react-native-modal'
import { MenuScreen } from './MenuScreen'
import OneSignal from 'react-native-onesignal'
import moment from 'moment'
import { IHotel, INews, INotification, ITour } from 'models'
// @ts-ignore
import ActionButton from 'react-native-circular-action-menu'
import { HomeScreen, HotelDetailScreen, NewsDetailScreen, TourDetailScreen } from 'screens'
import { apiUpdateOnesignalId } from 'modules/api'

type TabParams = {
    HOME: undefined
    PANIC: undefined
    NOTIFICATIONS: undefined
    MENU: undefined
    news: undefined
    eservices: undefined
    wantedList: undefined
    jobs: undefined
    projects: undefined
    hotels: undefined
    tourism: undefined
    propertyRate: undefined
    complain: undefined
    permit: undefined
    flagship: undefined
    profile: undefined
    newsDetail: {
        news: INews
    }
    hotelDetail: {
        hotel: IHotel
    }
    tourDetail: {
        tour: ITour
    } 
}

const actions = [
    {
      text: "News",
      icon: images.newsAction,
        color: appColors.purple,
      name: "newsAction",
      position: 1
    },
    {
      text: "Property Rate",
      icon: images.propertyRate,
        color: appColors.purple,
      name: "propertyRate",
      position: 2
    },
    {
      text: "Complain",
      icon: images.complain,
        color: appColors.purple,
      name: "complain",
      position: 3
    },
    {
      text: "Permit",
      icon: images.permit,
        color: appColors.purple,
      name: "permit",
      position: 4
    },
    {
        text: "Flagship Program",
        icon: images.flagshipAction,
          color: appColors.purple,
        name: "flagship",
        position: 5
      }
    ];
const Tab = createBottomTabNavigator<TabParams>()
export type TabNavigationProp = CompositeNavigationProp<LoggedInStackNavigationProps, BottomTabNavigationProp<TabParams>>
export type MenuTabScreenProp = BottomTabScreenProps<TabParams, 'MENU'>
export type NewsDetailTabNavigationProp = BottomTabNavigationProp<TabParams, 'newsDetail'>
export type TourDetailTabNavigationProp = BottomTabNavigationProp<TabParams, 'tourDetail'>
export type HotelDetailTabNavigationProp = BottomTabNavigationProp<TabParams, 'hotelDetail'>
export type NewsDetailTabScreenProp = BottomTabScreenProps<TabParams, 'newsDetail'>
export type TourDetailTabScreenProp = BottomTabScreenProps<TabParams, 'tourDetail'>
export type HotelDetailTabScreenProp = BottomTabScreenProps<TabParams, 'hotelDetail'>

export function TabScreen() {
    const {HEIGHT, appStyles, FONT, WIDTH} = useDesignScale()
    const [isVisible, setIsVisible] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const navigation = useNavigation<TabNavigationProp>()
    const dispatch = useDispatch()
    useEffect(()=>{
        OneSignal.getDeviceState().then(data=>{
            const onesignalId = data?.userId
            if (onesignalId) {
                console.log('onesignalId:', onesignalId)
                OneSignal.setExternalUserId(onesignalId)
                apiUpdateOnesignalId(onesignalId)
            }
        })

        //Prompt for push on iOS
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        })

        //Method for handling notifications received while app in foreground
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
            let notification = notificationReceivedEvent.getNotification();
            console.log("notification: ", notification);
            const data = notification.additionalData as {[id: string]: string}
            console.log("additionalData: ", data);
            // Complete with null means don't show a notification.
            const {notificationId, title, body, bigPicture } = notification
            if (data) {
                const {news_id, external_link} = data
                const n: INotification = {notificationId, news_id, title, body, bigPicture, external_link, read: false, date: moment().format()}
                dispatch(addNotification(n))
            }
            notificationReceivedEvent.complete(notification)
        })

        //Method for handling notifications opened
        OneSignal.setNotificationOpenedHandler(notification => {
            console.log("OneSignal: notification opened:", notification);
            const data = notification.notification.additionalData as {[id: string]: string}
            console.log("additionalData: ", data);
            // Complete with null means don't show a notification.
            const {notificationId, title, body, bigPicture } = notification.notification
            if (data) {
                const {news_id, external_link} = data
                const n: INotification = {notificationId, news_id, title, body, bigPicture, external_link, read: false, date: moment().format()}
                dispatch(addNotification(n))
            }
            // const {notificationId} = notification.notification
            // dispatch(readNotification(notificationId))
            navigation.navigate('NOTIFICATIONS')
        })

    }, [])
    const handleLogout = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        dispatch(clearProfile())
        navigation.reset({routes: [{
            name: 'splash'
        }]})
    }
    const handleCancel = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
    }
    const handleFlagshipProgram = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('flagship')
    }
    const handleComplaints = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('complain')
    }
    const handleEmergencyServiecs = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('eservices')
    }
    const handleProjects = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('projects')
    }
    const handlePermits = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('permit')
    }
    const handleProptertyRates = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('propertyRate')
    }
    const handleWantedList = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('wantedList')
    }
    const handleJobs = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('jobs')
    }
    const handleHotels = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('hotels')
    }
    const handleTourism = ()=>{
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('tourism')
    }
    const handleProfile = () => {
        setIsVisible(false)
        setMenuVisible(false)
        navigation.navigate('profile')
    }
    return (
        <View style={{flex: 1}}>
            <Tab.Navigator
                backBehavior='history'
                tabBar={({state, descriptors, navigation, insets})=>{
                    const {routes} = state
                            // <BottomTabBar state={{...state, routes: routes.slice(0, 4)}} descriptors={descriptors} navigation={navigation} insets={insets}/>
                    return (
                        <View style={{
                            backgroundColor: `${appColors.purple}50`,
                            flexDirection: 'row', height: HEIGHT(120), paddingVertical: HEIGHT(10)}}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={()=>navigation.navigate('HOME')}
                                accessibilityRole='button'
                                style={{flex: 1, alignItems: 'center'}}>
                                <Image source={images.home} style={appStyles.tabIcon} resizeMode='contain'/>
                                <Text style={[appStyles.text12, {marginTop: 8}]}>HOME</Text>
                            </TouchableOpacity>
                            <View style={{width: 1, height: HEIGHT(110), backgroundColor: appColors.white}}/>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    navigation.navigate('PANIC')
                                }}
                                accessibilityRole='button'
                                style={{flex: 1, alignItems: 'center'}}>
                                <Image source={images.panic} style={appStyles.tabIcon} resizeMode='contain'/>
                                <Text style={[appStyles.text12, {marginTop: 8}]}>PANIC</Text>
                            </TouchableOpacity>
                            <View style={{width: 1, height: HEIGHT(110), backgroundColor: appColors.white}}/>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={()=>navigation.navigate('NOTIFICATIONS')}
                                accessibilityRole='button'
                                style={{flex: 1, alignItems: 'center'}}>
                                <Image source={images.notifications} style={appStyles.tabIcon} resizeMode='contain'/>
                                <Text style={[appStyles.text12, {marginTop: 8}]}>NOTIFICATIONS</Text>
                            </TouchableOpacity>
                            <View style={{width: 1, height: HEIGHT(110), backgroundColor: appColors.white}}/>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={()=>setMenuVisible(true)}
                                accessibilityRole='button'
                                style={{flex: 1, alignItems: 'center'}}>
                                <Image source={images.menu} style={appStyles.tabIcon} resizeMode='contain'/>
                                <Text style={[appStyles.text12, {marginTop: 8}]}>MENU</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                sceneContainerStyle={{flex: 1}}
                screenOptions={({route})=>{
                    return {
                        headerShown: false,
                        // tabBarStyle: {
                        //     height: HEIGHT(114),
                        //     paddingBottom: HEIGHT(20),
                        //     backgroundColor: appColors.tab
                        // },
                        // tabBarLabelStyle: {
                        //     color: appColors.black
                        // },
                        // tabBarIcon: ({color, size})=>{
                        //     switch (route.name) {
                        //         case 'HOME':
                        //             return <Image source={images.home} style={appStyles.tabIcon} resizeMode='contain'/>
                        //         case 'PANIC':
                        //             return <Image source={images.panic} style={appStyles.tabIcon} resizeMode='contain'/>
                        //         case 'NOTIFICATIONS':
                        //             return <Image source={images.notifications} style={appStyles.tabIcon} resizeMode='contain'/>
                        //         case 'MENU':
                        //             return <Image source={images.menu} style={appStyles.tabIcon} resizeMode='contain'/>
                        //     }
                        // }
                    }
                }}
            >
                <Tab.Screen name='HOME' component={HomeScreen} />
                <Tab.Screen name='PANIC' component={EmergencyServicesSreen} />
                <Tab.Screen name='NOTIFICATIONS' component={NotificationsScreen} />
                <Tab.Screen name='MENU' component={MenuScreen} />
                <Tab.Screen name='news' component={NewsScreen}/>
                <Tab.Screen name='eservices' component={EmergencyServicesSreen}/>
                <Tab.Screen name='wantedList' component={WantedListScreen}/>
                <Tab.Screen name='jobs' component={JobsScreen}/>
                <Tab.Screen name='projects' component={ProjectsScreen}/>
                <Tab.Screen name='hotels' component={HotelsScreen}/>
                <Tab.Screen name='tourism' component={TourismScreen}/>
                <Tab.Screen name='propertyRate' component={PropertyRateScreen}/>
                <Tab.Screen name='complain' component={ComplainsScreen}/>
                <Tab.Screen name='permit' component={PermitScreen}/>
                <Tab.Screen name='flagship' component={FlagshipsScrees}/>
                <Tab.Screen name='profile' component={ProfileScreen}/>
                <Tab.Screen name='newsDetail' component={NewsDetailScreen}/>
                <Tab.Screen name='hotelDetail' component={HotelDetailScreen}/>
                <Tab.Screen name='tourDetail' component={TourDetailScreen}/>

            </Tab.Navigator>
            <Modal isVisible={menuVisible}
                animationIn='slideInRight'
                animationOut='slideOutRight'
                backdropOpacity={0}
                onBackdropPress={()=>setMenuVisible(false)}
                style={{marginRight: 1, marginBottom: HEIGHT(120), alignItems: 'flex-end', justifyContent: 'flex-end'}}
            >
                <View style={{
                    borderRadius: 5,
                    paddingEnd: WIDTH(20),
                    paddingStart: WIDTH(50),
                    paddingTop: 8,
                    paddingBottom: HEIGHT(30),
                    width: WIDTH(250), backgroundColor: appColors.white}}>
                    <Pressable
                        onPress={()=>setMenuVisible(false)}
                        style={appStyles.center}>
                        <Image source={images.Grabber}/>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleFlagshipProgram()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Flagship Program</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleComplaints()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Complain</Text>
                    </Pressable>
                    {/* <Pressable
                        onPress={()=>handleEmergencyServiecs()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Emergency Services</Text>
                    </Pressable> */}
                    <Pressable
                        onPress={()=>handleProjects()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Project</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handlePermits()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Permit</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleProptertyRates()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Property Rate</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleWantedList()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Wanted List</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleHotels()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Hotels</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleTourism()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Tourism</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleJobs()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Jobs</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleProfile()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={appStyles.text22}>Profile</Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleLogout()}
                        style={{marginTop: HEIGHT(40)}}>
                        <Text style={[appStyles.text22, {color: appColors.logout}]}>Logout</Text>
                    </Pressable>
                </View>
            </Modal>
            {/* <View style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }}>
                <Menu visible={isVisible}>
                    <MenuItem onPress={handleEmergencyServiecs}>Emergency Services</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleProjects}>Projects</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleWantedList}>Wanted List</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleJobs}>Jobs</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleHotels}>Hotels</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleTourism}>Tourism</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleProfile}>Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem textStyle={{color: appColors.logout}}onPress={handleLogout}>Logout</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={handleCancel}>Cancel</MenuItem>
                </Menu>
            </View> */}
            <ActionButton
                startDegree={245}
                endDegree={400}
                end
                containerStyle={{
                    bottom: HEIGHT(110)+WIDTH(70), left: -WIDTH(250)
                }}
                bgColor={`${appColors.purple}90`}
                icon={<Image source={images.floatingButton} style={{width: WIDTH(70), height: WIDTH(70)}}/>}
                radius={WIDTH(100)}
                // position='left'
                buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => navigation.navigate('news')}>
                    <View>
                        <Image source={images.newsAction} style={{width: WIDTH(50), height: WIDTH(50)}}/>
                        <View style={[appStyles.absolute, appStyles.center]}>
                            <Image source={images.newsFloatPath} style={{width: WIDTH(70), height: WIDTH(40)}}/>
                        </View>
                    </View>
                </ActionButton.Item>
                {/* <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => navigation.navigate('propertyRate')}>
                    <View>
                        <Image source={images.propertyRateAction} style={{width: WIDTH(57), height: WIDTH(51)}}/>
                        <View style={[appStyles.absolute, appStyles.center]}>
                            <Image source={images.propertyFloatPath} style={{width: WIDTH(76), height: WIDTH(39)}}/>
                        </View>
                    </View>
                </ActionButton.Item> */}
                <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => navigation.navigate('complain')}>
                    <View>
                        <Image source={images.complaintAction} style={{width: WIDTH(52), height: WIDTH(40)}}/>
                        <View style={[appStyles.absolute, appStyles.center]}>
                            <Image source={images.complaintPath} style={{width: WIDTH(100), height: WIDTH(40)}}/>
                        </View>
                    </View>
                </ActionButton.Item>
                {/* <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => navigation.navigate('permit')}>
                    <View>
                        <Image source={images.permitAction} style={{width: WIDTH(40), height: WIDTH(48)}}/>
                        <View style={[appStyles.absolute, appStyles.center]}>
                            <Image source={images.permitPath} style={{width: WIDTH(57), height: WIDTH(16)}}/>
                        </View>
                    </View>
                </ActionButton.Item> */}
                <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => navigation.navigate('flagship')}>
                    <View>
                        <Image source={images.flagshipAction} style={{width: WIDTH(55), height: WIDTH(55)}}/>
                        <View style={[appStyles.absolute, appStyles.center]}>
                            <Image source={images.flagshipPath} style={{resizeMode: 'cover', width: WIDTH(100), height: WIDTH(80)}}/>
                        </View>
                    </View>
                </ActionButton.Item>
            </ActionButton>
            {/* <FloatingAction
                position='left'
                tintColor={appColors.white}
                color={appColors.purple}
                overlayColor={`${appColors.purple}80`}
                floatingIcon={<Ionicons name='compass' size={WIDTH(40)}/>}
                distanceToEdge={{vertical: WIDTH(70)+HEIGHT(110), horizontal: WIDTH(70)}}
                actions={actions}
                onPressItem={item=>{
                    switch (item) {
                        case 'newsAction':
                            navigation.navigate('news')
                            break
                        case 'propertyRate':
                            navigation.navigate('propertyRate')
                            break
                        case 'complain':
                            navigation.navigate('complain')
                            break
                        case 'permit':
                            navigation.navigate('permit')
                            break
                        case 'flagship':
                            navigation.navigate('flagship')
                            break
                        default:
                            break
                    }
                }}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
})
