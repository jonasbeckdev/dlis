import React, { useState } from 'react'
import {Image, Keyboard, Text, TouchableOpacity, View} from 'react-native'
import { GradientListContainer, StyledButton, StyledInput } from 'components'
import { useDesignScale } from 'modules/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'
import { imageBase, testingPasword } from 'modules/constants'
import { appColors, images } from 'assets'
import Modal from 'react-native-modal'
import Feather from 'react-native-vector-icons/Feather'
import { apiUpdatePassword, apiUpdateProfile, apiUploadUserPic } from 'modules/api'
import { handleException } from 'modules/functions'
import { Hoshi } from "react-native-textinput-effects"
import DropDownPicker from 'react-native-dropdown-picker'
import { resetHome, setProfile, setProfilePhoto } from 'reduxsaga/actions'
import ImagePicker from 'react-native-image-crop-picker';

export function ProfileScreen() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const [edit, setEdit] = useState(false)
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    const districtReducer = useSelector((state: IRootState)=>state.districtReducer)
    const [changePass, setChangePass] = useState(false)
    const [changePassSuccess, setChangePassSuccess] = useState(false)
    const [secureTextEntry1, setSecureTextEntry1] = useState(true)
    const [secureTextEntry2, setSecureTextEntry2] = useState(true)
    const [secureTextEntry3, setSecureTextEntry3] = useState(true)
    const [old_password, setOld_password] = useState(__DEV__?testingPasword:'')
    const [new_password, setNew_password] = useState('')
    const [confirm_password, setConfirm_password] = useState('')
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(user?.name)
    const [phone, setPhone] = useState(user?.phone)
    const [family_phone, setFamily_phone] = useState(user?.family_phone)
    const [saveLoading, setSaveLoading] = useState(false)
    const [district_id, setDistrict] = useState(user?.district_id)
    const [openDistricts, setOpenDistricts] = useState(false)
    const [avatarEdit, setAvatarEdit] = useState(false)
    const dispatch = useDispatch()
    const handleSaveProfile = ()=>{
        if (name && phone && family_phone && district_id) {
            setSaveLoading(true)
            apiUpdateProfile({name, phone, family_phone, district_id}).then(()=>{
                setSaveLoading(false)
                dispatch(setProfile({id: user!.id, phone, name, district_id, family_phone}))
                // dispatch(resetHome())
                setEdit(false)
            }).catch(exception=>{
                setSaveLoading(false)
                handleException(exception)
            })
        }
    }
    return (
        <GradientListContainer>
            <View style={{flex: 1, margin: 16}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={appStyles.menuTitle}>Profile</Text>
                </View>
                {
                    user &&
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            onPress={()=>setAvatarEdit(true)}
                            style={{alignItems: 'center'}}>
                        {
                            user.pic?
                            <Image resizeMode='contain' source={{uri: imageBase+user.pic}} style={{width: WIDTH(140), height: WIDTH(180), borderRadius: WIDTH(70)}}/>
                            :
                            <Image resizeMode='contain' source={images.logo} style={{width: WIDTH(140), height: WIDTH(180), borderRadius: WIDTH(70)}}/>
                        }
                        {
                            edit && <Text style={{marginTop: 4}}>Edit</Text>
                        }
                        </TouchableOpacity>
                        {
                            edit
                            ?
                            <View style={{flex: 1, marginTop: 8, marginHorizontal: 32}}>
                                <Hoshi
                                    defaultValue={name}
                                    onChangeText={setName}
                                    inputStyle={appStyles.hosiInput}
                                    labelStyle={{color: appColors.black}} label='Full Name'/>
                                <Hoshi
                                    defaultValue={phone}
                                    onChangeText={setPhone}
                                    keyboardType='phone-pad'
                                    inputStyle={appStyles.hosiInput}
                                    labelStyle={{color: appColors.black}} label='Phone' style={{marginTop: 8}}/>
                                <Hoshi
                                    defaultValue={family_phone}
                                    onChangeText={setFamily_phone}
                                    inputStyle={appStyles.hosiInput}
                                    keyboardType='phone-pad'
                                    labelStyle={{color: appColors.black}} label='Emergency Phone' style={{marginTop: 8}}/>
                                <DropDownPicker
                                    listMode='SCROLLVIEW'
                                    open={openDistricts}
                                    setOpen={setOpenDistricts}
                                    style={{
                                        marginTop: 8, width: WIDTH(327), backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 1
                                    }}
                                    containerStyle={{width: WIDTH(327)}}
                                    value={district_id??null}
                                    setValue={setDistrict}
                                    placeholder='District'
                                    placeholderStyle={appStyles.subTitle14}
                                    // dropDownContainerStyle={{backgroundColor: 'transparent'}}
                                    listItemLabelStyle={appStyles.subTitle14}
                                    items={Object.values(districtReducer.districts).map((district, index)=>{
                                        return {
                                            label: district.name,
                                            value: district.id
                                        }
                                    })}
                                />
                                <View style={[appStyles.rowCenter, {marginTop: 8, justifyContent: 'center'}]}>
                                    <StyledButton title='Cancel' enabled style={{}} onPress={()=>setEdit(false)}/>
                                    <StyledButton
                                        loading={saveLoading}
                                        enabled={name&&phone&&family_phone&&district_id&&(district_id!=user.district_id||name!=user.name||phone!=user.phone||family_phone!=user.family_phone)?true:false}
                                        title='SAVE' style={{marginStart: 8}} onPress={handleSaveProfile}/>
                                </View>
                            </View>
                            :
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={[appStyles.text14, {marginTop: 8, color: appColors.white}]}>Full Name</Text>
                                <Text style={appStyles.text14}>{user.name}</Text>
                                <View style={appStyles.rowCenter}>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={[appStyles.text14, {color: appColors.white}]}>Phone</Text>
                                        <Text style={appStyles.text14}>{user.phone}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={[appStyles.text14, {color: appColors.white}]}>Emergency Phone</Text>
                                        <Text style={appStyles.text14}>{user.family_phone}</Text>
                                    </View>
                                </View>
                                <Text style={[appStyles.text14, {color: appColors.white}]}>District</Text>
                                <Text style={appStyles.text14}>{districtReducer.districts[user.district_id!].name}</Text>
                                <View style={[appStyles.rowCenter, {marginTop: 8}]}>
                                    <StyledButton
                                        onPress={()=>setEdit(true)}
                                        title='EDIT PROFILE' titleColor={appColors.white} enabled style={{width: WIDTH(180)}}/>
                                    <StyledButton
                                        onPress={()=>setChangePass(true)}
                                        title='CHANGE PASSWORD' titleColor={appColors.white} enabled style={{marginStart: 8, width: WIDTH(200)}}/>
                                </View>
                            </View>
                        }
                        <Modal
                            isVisible={changePass}>
                            <View
                                style={{
                                    backgroundColor: appColors.white,
                                    borderRadius: 5,
                                }}>
                                <View style={{
                                    borderRadius: 5,
                                    height: HEIGHT(125),
                                    width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: `${appColors.purple}50`}}>
                                    <Image source={images.redBall} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30)}}/>
                                    <Text style={{color: appColors.black}}>Change Password</Text>
                                </View>
                                <View style={{marginHorizontal: 16}}>
                                    <View style={{borderRadius: 4, borderWidth: 1, borderColor: appColors.grey, marginTop: 8}}>
                                    <StyledInput
                                        value={old_password}
                                        onChangeText={setOld_password}
                                        secureTextEntry={secureTextEntry1} placeholder='Old Password'/>
                                    <View style={{position: 'absolute', top: 0, bottom: 0, right: 16, justifyContent: 'center'}}>
                                        <Feather
                                            onPress={()=>{
                                                setSecureTextEntry1(!secureTextEntry1)
                                            }}
                                            name='eye-off' size={16} color={appColors.black}/>
                                    </View>
                                    </View>
                                    <View style={{borderRadius: 4, borderWidth: 1, borderColor: appColors.grey, marginTop: 8}}>
                                    <StyledInput
                                        value={new_password}
                                        onChangeText={setNew_password}
                                        secureTextEntry={secureTextEntry2} placeholder='New Password'/>
                                    <View style={{position: 'absolute', top: 0, bottom: 0, right: 16, justifyContent: 'center'}}>
                                        <Feather
                                            onPress={()=>{
                                                setSecureTextEntry2(!secureTextEntry2)
                                            }}
                                            name='eye-off' size={16} color={appColors.black}/>
                                    </View>
                                    </View>
                                    <View style={{borderRadius: 4, borderWidth: 1, borderColor: appColors.grey, marginTop: 8}}>
                                    <StyledInput
                                        value={confirm_password}
                                        onChangeText={setConfirm_password}
                                        secureTextEntry={secureTextEntry3} placeholder='Confirm Password'/>
                                    <View style={{position: 'absolute', top: 0, bottom: 0, right: 16, justifyContent: 'center'}}>
                                        <Feather
                                            onPress={()=>{
                                                setSecureTextEntry3(!secureTextEntry3)
                                            }}
                                            name='eye-off' size={16} color={appColors.black}/>
                                    </View>
                                    </View>
                                </View>
                                <View style={[appStyles.rowCenter, {alignSelf: 'center', marginVertical: 16}]}>
                                    <StyledButton
                                        style={{width: WIDTH(130)}}
                                        title='EXIT'
                                        enabled
                                        onPress={()=>{
                                            setChangePass(false)
                                        }}
                                    />
                                    <StyledButton
                                        loading={loading}
                                        style={{width: WIDTH(130), marginStart: 16}}
                                        title='APPLY'
                                        enabled={old_password&&new_password&&new_password==confirm_password?true:false}
                                        onPress={()=>{
                                            Keyboard.dismiss()
                                            setLoading(true)
                                            apiUpdatePassword({old_password, new_password}).then(()=>{
                                                setLoading(false)
                                                setChangePass(false)
                                                setTimeout(()=>{
                                                    setChangePassSuccess(true)
                                                }, 1000)
                                            }).catch(exception=>{
                                                setLoading(false)
                                                handleException(exception)
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            isVisible={changePassSuccess}>
                            <View
                                style={{
                                    backgroundColor: appColors.white,
                                    borderRadius: 5,
                                }}>
                                <View style={{
                                    borderRadius: 5,
                                    height: HEIGHT(125),
                                    width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: `${appColors.purple}50`}}>
                                    <Image source={images.redBall} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30)}}/>
                                    <Text style={{color: appColors.black}}>Password Change Successful</Text>
                                </View>
                                <View style={{alignItems: 'center', margin: 16}}>
                                    <Text>Your have successfully changed your password. Please not that you will be required to re- login with your new password.</Text>
                                    <StyledButton enabled style={{marginVertical: 16}} title='Close' onPress={()=>setChangePassSuccess(false)}/>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            onBackdropPress={()=>setAvatarEdit(false)}
                            isVisible={avatarEdit}>
                            <View
                                style={{
                                    backgroundColor: appColors.white,
                                    borderRadius: 5,
                                }}>
                                <View style={{
                                    borderRadius: 5,
                                    height: HEIGHT(125),
                                    width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: `${appColors.purple}50`}}>
                                    <Image source={images.redBall} resizeMode='contain' style={{width: WIDTH(30), height: WIDTH(30)}}/>
                                    <Text style={{color: appColors.black}}>Add Profile Photo</Text>
                                </View>
                                <View style={{alignItems: 'center', margin: 16}}>
                                    <StyledButton enabled style={{marginVertical: 16}} title='UPLOAD PHOTO'
                                        onPress={()=>{
                                            ImagePicker.openPicker({
                                                width: 300,
                                                height: 400,
                                                mediaType: 'photo',
                                                cropping: true
                                            }).then(image => {
                                                apiUploadUserPic(image).then(res=>{
                                                    dispatch(setProfilePhoto(res.pic))
                                                    setAvatarEdit(false)
                                                }).catch(exception=>{
                                                    handleException(exception)
                                                })
                                            }).catch(()=>{
                                            })
                                        }}/>
                                    <StyledButton enabled style={{marginVertical: 16}} title='TAKE A PHOTO'
                                        onPress={()=>{
                                            ImagePicker.openCamera({
                                                width: 300,
                                                height: 400,
                                                mediaType: 'photo',
                                                cropping: true,
                                            }).then(image => {
                                                apiUploadUserPic(image).then(res=>{
                                                    dispatch(setProfilePhoto(res.pic))
                                                    setAvatarEdit(false)
                                                }).catch(exception=>{
                                                    handleException(exception)
                                                })
                                            }).catch(()=>{
                                            })
                                        }}/>
                                </View>
                            </View>
                        </Modal>
                    </View>
                }
            </View>
        </GradientListContainer>
    )
}