import { appColors, images } from 'assets'
import { apiPropertics, apiPropRates, apiSendProperty } from 'modules/api'
import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import {FlatList, Image, Pressable, Text, TextInput, View} from 'react-native'
import { GradientContainer, ModalContainer, StyledButton, StyledRoundButton } from 'components'
import { IProperty, IPropRate } from 'models'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import { handleException } from 'modules/functions'
import DropDownPicker from 'react-native-dropdown-picker'
import { Hoshi } from 'react-native-textinput-effects'

export function PropertyRateScreen() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const [properties, setProperties] = useState<IProperty[]>()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [location, setLocation] = useState('')
    const [contact_address, setContact_address] = useState('')
    const [amount_paid, setAmount_paid] = useState('')
    const [rates, setRates] = useState<IPropRate[]>([])
    const [openRates, setOpenRates] = useState(false)
    const [property_rate, setProperty_rate] = useState<number|null>(null)
    const [selected, setSelected] = useState<IProperty>()
    const [thankRegister, setThankRegister] = useState(false)
    const loadProperties = ()=>{
        apiPropertics().then(result=>{
            setProperties(result)
        })
    }
    useEffect(()=>{
        loadProperties()
        apiPropRates().then(result=>{
            setRates(result)
        })
    }, [])
    return (
        <GradientContainer>
            <View style={{flex: 1, marginVertical: 16, marginHorizontal: 8}}>
                <View style={[appStyles.rowCenter, {justifyContent: 'flex-end'}]}>
                    <Image source={images.propertyRate} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30), marginEnd: 8}}/>
                    <Text style={[appStyles.menuTitle, {marginEnd: 8}]}>Property Rate</Text>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={properties}
                    keyExtractor={data=>data.id.toString()}
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
                                    colors={[appColors.background, appColors.lightPurple]}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        }}>
                                        <Image source={images.house} resizeMode='contain' style={{width: WIDTH(60), height: WIDTH(60), borderRadius: WIDTH(30)}} />
                                        <View style={{flex: 4, marginStart: 16}}>
                                            <Text>{item.property_code}</Text>
                                            <Text>{item.username}</Text>
                                        </View>
                                        <Text style={{flex: 1}}>{item.location}</Text>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        )
                    }}
                />
                <View style={appStyles.center}>
                    <StyledButton title='Register' enabled onPress={()=>setVisible(true)}/>
                </View>
                <ModalContainer
                    title='Register Rate'
                    isVisible={selected?true:false}>
                    <View style={{flexDirection: 'row', marginHorizontal: 16}}>
                        <View style={{flex: 1}}>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Owner Name</Text>
                                <Text style={appStyles.text14}>{selected?.username}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Location</Text>
                                <Text style={appStyles.text14}>{selected?.location}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Contact Email/Phone</Text>
                                <Text style={appStyles.text14}>{selected?.contact_address}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Property Rate</Text>
                                <Text style={appStyles.text14}>{selected?.property_rate_name}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Outstanding</Text>
                                <Text style={appStyles.text14}>{selected?.outstanding}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, marginStart: 8}}>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Code</Text>
                                <Text style={appStyles.text14}>{selected?.property_code}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Date of Registeration</Text>
                                <Text style={appStyles.text14}>{ }</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Type</Text>
                                <Text style={appStyles.text14}>{selected?.property_rate_name}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Paid Amount</Text>
                                <Text style={appStyles.text14}>{selected?.amount_paid}</Text>
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text style={appStyles.greyText12}>Amount</Text>
                                <Text style={appStyles.text14}>{selected?.property_rate_amount}</Text>
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
                <ModalContainer
                    title='Register Property'
                    onBackdropPress={()=>setVisible(false)}
                    isVisible={visible}>
                        <View style={{alignItems: 'center', marginVertical: 16}}>
                            <Hoshi
                                style={appStyles.hoshi}
                                inputStyle={[appStyles.hosiInput, {paddingBottom: 0}]}
                                labelStyle={appStyles.hosiLabel}
                                borderColor={appColors.grey}
                                label='Owner Name'
                                value={username}
                                onChangeText={setUsername}
                                />
                            <Hoshi
                                style={appStyles.hoshi}
                                inputStyle={appStyles.hosiInput}
                                labelStyle={appStyles.hosiLabel}
                                borderColor={appColors.grey}
                                value={location}
                                onChangeText={setLocation}
                                label='Town or City'
                                />
                            <Hoshi
                                style={appStyles.hoshi}
                                inputStyle={appStyles.hosiInput}
                                labelStyle={appStyles.hosiLabel}
                                borderColor={appColors.grey}
                                value={contact_address}
                                onChangeText={setContact_address}
                                label='Contact Email/Phone'
                                />
                            <Hoshi
                                style={appStyles.hoshi}
                                inputStyle={appStyles.hosiInput}
                                labelStyle={appStyles.hosiLabel}
                                borderColor={appColors.grey}
                                value={amount_paid}
                                onChangeText={setAmount_paid}
                                keyboardType='numeric'
                                label='Property Rate Amount'
                                />
                            <DropDownPicker
                                items={rates?.map(rate=>{
                                    return {
                                        label: rate.name,
                                        value: rate.id
                                    }
                                })}
                                listMode='SCROLLVIEW'
                                placeholder='Property Rate'
                                placeholderStyle={{color: appColors.grey}}
                                open={openRates}
                                setOpen={setOpenRates}
                                style={{
                                    height: WIDTH(55),
                                    paddingStart: 20,
                                    width: WIDTH(327), backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 1
                                }}
                                containerStyle={{
                                    width: WIDTH(327)}}
                                value={property_rate}
                                setValue={setProperty_rate}
                                        />
                            <StyledRoundButton
                                loading={loading}
                                enabled={username&&location&&contact_address&&amount_paid&&property_rate?true:false}
                                style={{
                                    width: WIDTH(120),
                                    marginTop: 8}} title='Register' onPress={()=>{
                                    setLoading(true)
                                    apiSendProperty({
                                        username,
                                        location,
                                        contact_address,
                                        property_rate: property_rate!,
                                        property_code: Date.now(),
                                        amount_paid}).then(()=>{
                                        setVisible(false)
                                        setLoading(false)
                                        setTimeout(()=>{
                                            setThankRegister(true)
                                            setUsername('')
                                            setContact_address('')
                                            setLocation('')
                                            setAmount_paid('')
                                            setProperty_rate(null)
                                        }, 1000)
                                    }).catch(exception=>{
                                        setLoading(false)
                                        handleException(exception)
                                    })
                                }}/>
                        </View>
                </ModalContainer>
                <ModalContainer isVisible={thankRegister} title={'Property Registered'}>
                    <View style={{alignItems: 'center', marginVertical: 16}}>
                        <Text>Thank you for Registering your property</Text>
                        <StyledButton
                            enabled
                            style={{
                                marginTop: 80}}
                            onPress={()=>{
                                setThankRegister(false)
                                loadProperties()
                            }}
                            title='Done'
                        />
                    </View>
                </ModalContainer>
            </View>
        </GradientContainer>
    )
}