import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import Modal from "react-native-modal"
import { images, appColors } from 'assets'
import { useDesignScale } from 'modules/hooks'

interface ModalContainerProps {
    title: string
    isVisible: boolean
    image?: ImageSourcePropType
    onBackdropPress?(): void
    backdropOpacity?: number
    children: JSX.Element | JSX.Element[]
}
export function ModalContainer({title, backdropOpacity, isVisible, children, onBackdropPress, image}: ModalContainerProps) {
  const {appStyles, HEIGHT, WIDTH} = useDesignScale()
  return (
    <Modal
      backdropOpacity={backdropOpacity}
      style={{marginHorizontal: WIDTH(40)}}
      onBackdropPress={onBackdropPress}
      isVisible={isVisible}>
      <View
        style={{
            backgroundColor: appColors.white,
            borderRadius: 5,
        }}>
        <View style={{
            borderRadius: 5,
            width: '100%', alignItems: 'center', backgroundColor: `${appColors.purple}50`}}>
            <Image source={image??images.ellipse1} resizeMode='contain' style={{marginTop: 16, width: WIDTH(30), height: WIDTH(30)}}/>
            <Text style={{marginVertical: 24, color: appColors.black}}>{title}</Text>
        </View>
        {children}
      </View>
    </Modal>
  )
}