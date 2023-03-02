import React from 'react'
import { SafeAreaView } from "react-native"
import { appColors } from 'assets'

export const SafeAreaContanier = ({bottom, top, children}: {top?: string, bottom?: string, children: JSX.Element})=>{
    return (
        <>
        <SafeAreaView style={{flex: 0, backgroundColor: top?top:appColors.background}}/>
        <SafeAreaView style={{flex: 1, backgroundColor: bottom?bottom:appColors.background}}>
            {children}
        </SafeAreaView>
        </>
    )
}