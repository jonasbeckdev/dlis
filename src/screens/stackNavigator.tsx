import React from 'react'
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { 
    VerifyPhoneScreen,
    TabScreen,
    PasswordResetScreen,
    SignupScreen, DistrictScreen, SplashScreen, AdvertiseScreen, LoginScreen } from 'screens'
import { useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'

type SplashStackParam = {
    splash: undefined
    advertise: undefined
    main: undefined
}

type MainStackParam = {
    loginStack: undefined
    loggedInStack: undefined
}

type LoginStackParam = {
    district: undefined
    login: undefined
    signup: undefined
    passwordReset: undefined
}

type LoggedInStackParam = {
    verifyPhone: undefined
    home: undefined
}

const SplashStack = createNativeStackNavigator<SplashStackParam>()
const MainStack = createNativeStackNavigator<MainStackParam>()
const LoginStack = createNativeStackNavigator<LoginStackParam>()
const LoggedInStack = createNativeStackNavigator<LoggedInStackParam>()
export type SplashStackScreenProps = NativeStackScreenProps<SplashStackParam>
export type LoginStackScreenProps = NativeStackScreenProps<LoginStackParam>
export type MainStackScreenProps = NativeStackScreenProps<MainStackParam>
export type LoggedInStackScreenProps = CompositeScreenProps<
    SplashStackScreenProps,
    CompositeScreenProps<MainStackScreenProps, NativeStackScreenProps<LoggedInStackParam>>>
export type LoggedInStackNavigationProps = CompositeNavigationProp<
    NativeStackNavigationProp<SplashStackParam>,
    CompositeNavigationProp<NativeStackNavigationProp<MainStackParam>, NativeStackNavigationProp<LoggedInStackParam>>>

export function LoginNavigator() {
    return (
        <LoginStack.Navigator screenOptions={{headerShown: false}}>
            <LoginStack.Screen name='district' component={DistrictScreen}/>
            <LoginStack.Screen name='login' component={LoginScreen}/>
            <LoginStack.Screen name='signup' component={SignupScreen}/>
            <LoginStack.Screen name='passwordReset' component={PasswordResetScreen}/>
        </LoginStack.Navigator>
    )
}

export function LoggedInNavigator() {
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    if (!user) {
        return null
    }
    return (
        <LoggedInStack.Navigator screenOptions={{headerShown: false}}>
            {user.verified!=1 && <LoggedInStack.Screen name='verifyPhone' component={VerifyPhoneScreen}/>}
            <LoggedInStack.Screen name='home' component={TabScreen}/>
        </LoggedInStack.Navigator>
    )
}

export function MainNavigator() {
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
        {
            user
            ?
            <MainStack.Screen name='loggedInStack' component={LoggedInNavigator}/>
            :
            <MainStack.Screen name='loginStack' component={LoginNavigator}/>
        }
        </MainStack.Navigator>
    )
}

export function SplashNavigator() {
    return (
        <SplashStack.Navigator screenOptions={{headerShown: false}}>
            <SplashStack.Screen name='splash' component={SplashScreen}/>
            <SplashStack.Screen name='advertise' component={AdvertiseScreen}/>
            <SplashStack.Screen name='main' component={MainNavigator}/>
        </SplashStack.Navigator>
    )
}
