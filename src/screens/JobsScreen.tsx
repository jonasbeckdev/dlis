import React, { useEffect, useState } from 'react'
import { GradientListContainer } from 'components'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useDesignScale } from 'modules/hooks'
import { IJob } from 'models'
import { apiJobs } from 'modules/api'
import LinearGradient from 'react-native-linear-gradient'
import { appColors, images } from 'assets'
import { imageBase } from 'modules/constants'
import moment from 'moment'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { IRootState } from 'reduxsaga/reducers'

type JobStackParams = {
    jobs: undefined
    jobDetail: {
        job: IJob
    }
}
export const JobStackNavigator = createNativeStackNavigator<JobStackParams>()
type JobDetailScreenProps = NativeStackScreenProps<JobStackParams, 'jobDetail'>

export function JobsScreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [jobs, setJobs] = useState<IJob[]>([])
    const [selected, setSelected] = useState<IJob>()
    const user = useSelector((state: IRootState)=>state.userReducer.user)
    useEffect(()=>{
        apiJobs().then(jobs=>{
            setJobs(jobs)
        })
    }, [user])
    return (
        <GradientListContainer>
            <View
                style={{flex: 1, margin: 16}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={appStyles.menuTitle}>Jobs</Text>
                </View>
                <Text style={[appStyles.menuTitle, {alignSelf: 'center'}]}>Job Offers</Text>
                {
                    jobs.map(job=>{
                        return (
                            <Pressable
                                key={job.id}
                                onPress={()=>setSelected(job)}>
                            <LinearGradient
                                style={{
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginTop: 8,
                                    borderColor: appColors.blue,
                                }}
                                colors={[appColors.background, appColors.purple]}
                            >
                                <View style={{margin: 8, alignItems: 'center', flexDirection: 'row'}}>
                                    <Image source={{uri: imageBase+job.pic}} resizeMode='contain' style={{width: WIDTH(60), height: WIDTH(60), borderRadius: WIDTH(30)}} />
                                    <View style={{marginStart: 16, flex: 1}}>
                                        <View style={{alignItems: 'center'}}>
                                            <Text>{job.orderFrom}</Text>
                                        </View>
                                        <Text style={appStyles.montserrat}>{job.degreeLevel}</Text>
                                        <View style={[appStyles.rowCenter, {justifyContent: 'space-between'}]}>
                                            <Text>{job.years}years</Text>
                                            <Text>${job.salary}</Text>
                                        </View>
                                        <Text>{moment(job.expiresOn, 'mm/dd/yyyy').format('D MMM YYYY')}</Text>
                                    </View>
                                </View>
                            </LinearGradient>                                
                            </Pressable>
                        )
                    })
                }
                <Modal
                    backdropOpacity={0}
                    style={{margin: 0,
                        backgroundColor: appColors.white,
                        marginBottom: HEIGHT(114)}}
                    isVisible={selected?true:false}>
                    {
                        selected ?
                        <View style={{
                            margin: 16,
                            flex: 1}}>
                            <Pressable
                                onPress={()=>{
                                    setSelected(undefined)
                            }}>
                                <Image
                                    source={images.close}/>
                            </Pressable>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={appStyles.menuTitle}>Jobs</Text>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={appStyles.blueTitle25}>{selected?.orderFrom}</Text>
                            </View>
                            <View style={appStyles.rowCenter}>
                                <Image source={{uri: imageBase+selected.pic}} resizeMode='contain' style={{width: WIDTH(60), height: WIDTH(60), borderRadius: WIDTH(30)}} />
                                <View style={{marginStart: 16}}>
                                    <Text>Job Type</Text>
                                    <Text style={appStyles.montserrat}>{selected?.jobType}</Text>
                                </View>
                                <View style={{marginStart: 16}}>
                                    <Text>Expires On</Text>
                                    <Text style={appStyles.montserrat}>{moment(selected.expiresOn, 'mm/dd/yyyy').format('D MMM YYYY')}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 16}}>
                                <Text>Degree Level</Text>
                                <Text style={appStyles.montserrat}>{selected.degreeLevel}</Text>
                            </View>
                            <View style={[appStyles.rowCenter, {marginTop: 16}]}>
                                <View>
                                    <Text>Job Experience</Text>
                                    <Text style={appStyles.montserrat}>{selected.years}Years</Text>
                                </View>
                                <View style={{marginStart: 16}}>
                                    <Text>Slary Period</Text>
                                    <Text style={appStyles.montserrat}>{selected.salaryPeriod}</Text>
                                </View>
                                <View style={{marginStart: 16}}>
                                    <Text>Slary</Text>
                                    <Text style={appStyles.montserrat}>${selected.salary}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 16}}>
                                <Text>Functional Area</Text>
                                <Text style={appStyles.montserrat}>{selected.functionalArea}</Text>
                            </View>
                            <View style={{flex: 1, marginTop: 16}}>
                                <Text>Job Description</Text>
                                <ScrollView style={{flex: 1}}>
                                <Text style={appStyles.montserrat}>${selected.description}</Text>
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View/>
                    }
                </Modal>
            </View>
        </GradientListContainer>
    )
}

export function JobDetailScreen({route}: JobDetailScreenProps) {
    const {job} = route.params
}