import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { appColors, fonts } from "assets";
import { designHeight, designWidth } from "./constants"

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
const windowsFontScale = Dimensions.get('window').fontScale

export const useDesignScale = () => {
    const insets = useSafeAreaInsets();
    // console.log('insets:', insets)
    const HEIGHT = (h: number)=>{
        if (Platform.OS == 'ios') {
            return ((windowHeight-insets.top-insets.bottom)/(designHeight))*h
            // return ((windowHeight-insets.bottom-insets.top)/designHeight)*h
            // return ((windowHeight-insets.top)/designHeight)*h
        }
        return (windowHeight-(StatusBar.currentHeight?StatusBar.currentHeight:40))/designHeight*h
    }
    const FONT = (f: number)=>{
        return f/windowsFontScale
        // return ((windowHeight-insets.top-insets.bottom)/(designHeight))*f/windowsFontScale
    }
    const WIDTH = (w: number)=>{
        return (windowWidth/designWidth)*w
    }
    const appStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: appColors.background,
            fontFamily: fonts.Poppins
        },
        center: {
            alignItems: 'center', justifyContent: 'center'
        },
        rowCenter: {
            flexDirection: 'row', alignItems: 'center'
        },
        absolute: {
            position: 'absolute', top: 0, left: 0, bottom: 0, right: 0
        },
        capitalTitle: {
            color: appColors.white,
            fontSize: FONT(25),
            textAlign: 'center',
            fontFamily: fonts.Poppins
        },
        title24: {
            color: appColors.black,
            fontSize: FONT(24),
            fontWeight: 'bold',
            fontFamily: fonts.Poppins
        },
        title16: {
            color: appColors.black,
            fontSize: FONT(16),
            fontWeight: 'bold',
            fontFamily: fonts.Poppins
        },
        title20: {
            color: appColors.black,
            fontSize: FONT(20),
            fontWeight: 'bold',
            fontFamily: fonts.Poppins
        },
        text19: {
            color: appColors.white,
            fontSize: FONT(19),
            fontFamily: fonts.Poppins
        },
        text16: {
            color: appColors.white,
            fontSize: FONT(16),
            fontFamily: fonts.Poppins
        },
        text22: {
            fontSize: FONT(16),
            fontFamily: fonts.Poppins
        },
        subTitle14: {
            fontWeight: '500',
            color: appColors.black,
            fontSize: FONT(14),
            fontFamily: fonts.Montserrat
        },
        text14: {
            color: appColors.black,
            fontSize: FONT(14),
            fontFamily: fonts.Poppins
        },
        text10: {
            color: appColors.black,
            fontSize: FONT(10),
            fontFamily: fonts.Poppins
        },
        text12: {
            color: appColors.black,
            fontSize: FONT(12),
            fontFamily: fonts.Poppins
        },
        greyText12: {
            color: appColors.grey,
            fontSize: FONT(12),
            fontFamily: fonts.Poppins
        },
        tabIcon: {
            width: WIDTH(30), height: WIDTH(30)
        },
        shadow16: {
            fontSize: FONT(16),
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
            textShadowColor: appColors.black
        },
        menuTitle: {
            fontSize: FONT(16),
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
            textShadowColor: appColors.black,
            fontFamily: fonts.Poppins,
            color: '#2A2F33'
        },
        greenBorder: {
            fontSize: FONT(10),
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderColor: appColors.greenBorder,
            color: appColors.white,
            fontFamily: fonts.Poppins,
        },
        contactUs: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            fontSize: FONT(12),
            borderRadius: 15,
            backgroundColor: appColors.white,
            color: appColors.black,
            fontFamily: fonts.Poppins,
            textAlign: 'center'
        },
        hoshi: {
            width: WIDTH(320),
            height: WIDTH(65) 
        },
        borderStart: {
            paddingStart: 16, paddingVertical: 8, marginTop: 16, borderStartWidth: 1, borderStartColor: appColors.black
        },
        hosiInput: {
            fontSize: 14,
            fontFamily: fonts.Poppins,
            fontWeight: 'normal', color: appColors.black
        },
        hosiLabel: {
            fontSize: 14,
            fontFamily: fonts.Poppins,
            color: appColors.grey
        },
        blueTitle25: {
            fontSize: 25,
            fontFamily: fonts.Montserrat,
            color: appColors.blue
        },
        montserrat: {
            fontFamily: fonts.Montserrat,
            color: appColors.black
        },
        panicButton: {
            width: WIDTH(130), height: WIDTH(50)
        },
        circleItemImage: {
            width: WIDTH(60), height: WIDTH(60), borderRadius: WIDTH(30)
        }
        // shadow: {
        //     shadowColor: appColors.black,
        //     shadowOpacity: 1,
        //     shadowOffset: {width: 2, height: 0},
        //     elevation: 20,
        //     shadowRadius: 4
        // }
    })
    return {
        WIDTH, HEIGHT, FONT, appStyles
    }
}
