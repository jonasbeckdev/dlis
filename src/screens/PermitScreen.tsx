import { appColors, images } from 'assets'
import { GradientContainer, ModalContainer, StyledButton, StyledRoundButton } from 'components'
import { IPermit } from 'models'
import { apiNewPermit, apiPermits } from 'modules/api'
import { handleException } from 'modules/functions'
import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import {FlatList, Image, Keyboard, Pressable, Text, TextInput, View} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import { Hoshi } from 'react-native-textinput-effects'

export function PermitScreen() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [permits, setPermits] = useState<IPermit[]>()
    const [code, setCode] = useState('')
    const [selected, setSelected] = useState<IPermit>()
    const loadPermits = ()=>{
        apiPermits().then(result=>{
            setPermits(result)
        })
    }
    useEffect(()=>{
        loadPermits()
    }, [])
    return (
        <GradientContainer>
            <View style={{flex: 1, marginVertical: 16, marginHorizontal: 8}}>
                <View style={[appStyles.rowCenter, {justifyContent: 'flex-end'}]}>
                    <Image source={images.permit} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30), marginEnd: 8}}/>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Permit</Text>
                </View>
                <FlatList
                    style={{flex: 1}}
                    keyExtractor={item=>item.id.toString()}
                    renderItem={({item})=>{
                        return (
                                <Pressable
                                    onPress={()=>setSelected(item)}
                                    style={{
                                    borderColor: appColors.blue,
                                    borderWidth: 1,
                                    borderBottomWidth: 2,
                                    marginTop: 8,
                                    borderRadius: 5,
                            }}>
                                <LinearGradient
                                    style={{
                                        padding: 8, borderRadius: 3,
                                    }}
                                    colors={[appColors.background, appColors.lightPurple]}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        }}>
                                        <Image source={images.permitItem} resizeMode='contain' style={{width: WIDTH(60), height: WIDTH(60)}} />
                                        <View style={{flex: 4, marginStart: 16}}>
                                            <Text>{item.name}</Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                        {
                                            item.resolved==1?
                                            <Text>Completed</Text>
                                            :<Text>On Going</Text>
                                        }
                                        </View>
                                    </View>
                                </LinearGradient>
                                </Pressable>
                        )
                    }}
                    data={permits}/>
                <View style={appStyles.center}>
                    <StyledButton title='Register' enabled onPress={()=>setVisible(true)}/>
                </View>
                <ModalContainer
                    title='Permit Registeration'
                    onBackdropPress={()=>setVisible(false)}
                    isVisible={visible}>
                    <View style={{alignItems: 'center', marginVertical: 16}}>
                        <Hoshi
                            value={code}
                            inputStyle={appStyles.hosiInput}
                            labelStyle={appStyles.hosiLabel}
                            borderColor={appColors.grey}
                            onChangeText={setCode}
                            label='Jacket Number' style={appStyles.hoshi}/>
                        <StyledRoundButton
                            loading={loading}
                            enabled={code?true:false}
                            style={{marginTop: 8}} title='Submit' onPress={()=>{
                                setLoading(true)
                                Keyboard.dismiss()
                                apiNewPermit(code).then(()=>{
                                    setLoading(false)
                                    setCode('')
                                    setVisible(false)
                                    loadPermits()
                                }).catch(exception=>{
                                    setLoading(false)
                                    handleException(exception)
                                })
                            }}/>
                    </View>
                </ModalContainer>
                <ModalContainer title={'Permit'} isVisible={selected?true:false}>
                <View style={{flexDirection: 'row', marginHorizontal: 16}}>
                        <View style={{flex: 1}}>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Name</Text>
                                <Text style={appStyles.text14}>{selected?.name}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Location</Text>
                                <Text style={appStyles.text14}>{selected?.location}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Contact</Text>
                                <Text style={appStyles.text14}>{selected?.contact}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Permit Fee</Text>
                                <Text style={appStyles.text14}>{selected?.fee}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Outstanding</Text>
                                <Text style={appStyles.text14}>{selected?.outstanding_fee}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, marginStart: 8}}>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Jacket Number</Text>
                                <Text style={appStyles.text14}>{selected?.code}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Date of Registeration</Text>
                                <Text style={appStyles.text14}>{ }</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Purpose of building</Text>
                                <Text style={appStyles.text14}>{selected?.purpose}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Paid Amount</Text>
                                <Text style={appStyles.text14}>{selected?.amount_paid}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Stats</Text>
                                {
                                    selected?.resolved
                                    ?
                                    <Text style={appStyles.text14}>Completed</Text>
                                    :
                                    <Text style={appStyles.text14}>On Going</Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={appStyles.center}>
                        <Text style={appStyles.greyText12}>Remark</Text>
                        <Text style={appStyles.text14}>{}</Text>
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
            </View>
        </GradientContainer>
    )
}