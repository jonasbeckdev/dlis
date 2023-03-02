import React, { useState } from "react"
import { appColors, images } from "assets"
import { Button, Image, Pressable, StatusBar, Text, View } from "react-native"
import { useTranslation } from 'react-i18next'
import { Hoshi } from 'react-native-textinput-effects'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import en from 'dist/en.json'
import LinearGradient from "react-native-linear-gradient"
import { useDesignScale } from "modules/hooks"
import { LoginStackScreenProps } from "screens"
import { StyledButton } from "components"
import { useDispatch, useSelector } from "react-redux"
import { IRootState } from "reduxsaga/reducers"
import DropDownPicker from 'react-native-dropdown-picker'
import { activeDistrict } from "reduxsaga/actions"
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import Tooltip from 'react-native-walkthrough-tooltip'

export const DistrictScreen = ({navigation}: LoginStackScreenProps) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const {WIDTH, HEIGHT, appStyles} = useDesignScale()
    const districtReducer = useSelector((state: IRootState)=>state.districtReducer)
    // const [openDistricts, setOpenDistricts] = useState(false)
    const [district, setDistrict] = useState(districtReducer.selectedId)
    const [helpVisible, setHelpVisible] = useState(false)
    return (
        <KeyboardAwareScrollView
            extraHeight={150}
            enableOnAndroid
            keyboardShouldPersistTaps='always'
            contentContainerStyle={{flexGrow: 1}}
            style={[appStyles.container, {
                // borderColor: 'red', borderWidth: 1,
            }]}>
            <LinearGradient
                colors={[appColors.background, appColors.purple]}
                style={{
                    flex: 1,
                    // borderColor: 'red', borderWidth: 1,
                    alignItems: 'center'
                    }}>
                <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        marginTop: HEIGHT(140),
                        width: WIDTH(234), height: HEIGHT(195)}}
                    resizeMode='contain'
                    source={images.coa}/>
                <View style={{
                    alignSelf: 'flex-end',
                    marginTop: HEIGHT(80)
                }}>
                <Tooltip
                    placement='left'
                    backgroundColor='rgba(0,0,0,0)'
                    arrowSize={{width: 0, height: 0}}
                    onClose={()=>setHelpVisible(false)}
                    isVisible={helpVisible}
                    contentStyle={{backgroundColor: `#E2CAF2`}}
                    content={<Text style={{color: appColors.white}}>Start typing the name of your district and select it as it pops up</Text>}
                    >
                    <Pressable onPress={()=>setHelpVisible(true)}>
                        <Image source={images.help} style={{alignSelf: 'flex-end', width: WIDTH(64), height: WIDTH(26)}} />
                    </Pressable>
                </Tooltip>
                </View>
                <Text style={[appStyles.text19, {marginTop: HEIGHT(50), textAlign: 'center'}]}>Welcome, choose a District</Text>
                <AutocompleteDropdown
                    dataSet={Object.values(districtReducer.districts).map((district, index)=>{
                        return {
                            title: district.name,
                            id: district.id.toString()
                        }
                    })}
                    onSelectItem={item=>{
                        if (item) {
                            setDistrict(Number(item.id))
                        }
                    }}
                    inputContainerStyle={{
                        backgroundColor: appColors.transparent, borderWidth: 0, borderBottomWidth: 1    
                    }}
                    suggestionsListContainerStyle={{
                        backgroundColor: appColors.purple
                    }}
                    containerStyle={{
                        marginTop: 32,
                        width: WIDTH(327),
                    }}
                    textInputProps={{
                        defaultValue: district?districtReducer.districts[district].name:'',
                        placeholder: 'District',
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        placeholderTextColor: appColors.black
                    }}
                    />
                {/* <DropDownPicker
                    listMode='SCROLLVIEW'
                    open={openDistricts}
                    setOpen={setOpenDistricts}
                    style={{
                        marginTop: 32, width: WIDTH(327), backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 1
                    }}
                    containerStyle={{width: WIDTH(327)}}
                    value={district}
                    setValue={setDistrict}
                    placeholder='District'
                    placeholderStyle={appStyles.subTitle14}
                    // dropDownContainerStyle={{backgroundColor: 'transparent'}}
                    listItemLabelStyle={appStyles.subTitle14}
                    items={districtReducer.districts.map((district, index)=>{
                        return {
                            label: district.name,
                            value: index
                        }
                    })}
                /> */}
                {/* <Hoshi
                    style={{
                        marginTop: 32,
                        width: WIDTH(327)}}
                    label='District'
                    defaultValue={district}
                    labelStyle={{color: appColors.black}}
                    borderColor={appColors.black}
                    onChangeText={setDistrict}
                /> */}
                <StyledButton
                    style={{marginTop: HEIGHT(100)}}
                    enabled={district!=null?true:false}
                    title='Get started'
                    onPress={()=>{
                        dispatch(activeDistrict(district!))
                        navigation.navigate('login')
                    }}
                />
                <View style={{flex: 1}}/>
                <Text style={[appStyles.text16, {marginBottom: HEIGHT(32)}]}>© 2022</Text>
                </View>
            </LinearGradient>
        </KeyboardAwareScrollView>
    )
}