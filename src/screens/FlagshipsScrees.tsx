import React, { useEffect, useState } from 'react'
import {FlatList, Image, Text, View} from 'react-native'
import { GradientListContainer } from 'components'
import { useDesignScale } from 'modules/hooks'
import { appColors, images } from 'assets'
import { IProgram } from 'models'
import LinearGradient from 'react-native-linear-gradient'
import { imageBase } from 'modules/constants'
import { apiPrograms } from 'modules/api'
import Swiper from 'react-native-swiper'

export function FlagshipProgramItem({program}: {program: IProgram}) {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    return (
        <View
        style={{
            marginTop: 16}}>
            <View style={{alignItems: 'center', marginBottom: 8}}>
                <Text style={[appStyles.menuTitle, {color: program.titleColor}]}>{program.title}</Text>
            </View>
            {
                program.pics &&
                <View style={{height: WIDTH(420)}}>
                    <Swiper showsPagination={program.pics.length>1}>
                        {
                            program.pics.map((pic, index)=>{
                                return (
                                    <Image key={index} source={{uri: imageBase+pic}}
                                        style={{
                                            borderTopLeftRadius: 8, borderTopRightRadius: 8,
                                            width: WIDTH(420), height: WIDTH(420)}}
                                        resizeMode='cover'/>
                                )
                                })
                        }
                    </Swiper>
                </View>
            }
        {/* <FlatList
            horizontal
            ItemSeparatorComponent={()=><View style={{width: 8}}/>}
            keyExtractor={(item, index)=>index.toString()}
            data={program.pics}
            renderItem={({item: pic})=>{
                return (
                    <Image source={{uri: imageBase+pic}}
                        style={{
                            borderTopLeftRadius: 8, borderTopRightRadius: 8,
                            width: WIDTH(420), height: WIDTH(245)}}
                        resizeMode='stretch'/>
                )
            }}/> */}
        <LinearGradient
            style={{
                borderTopStartRadius: program.pics?0:8,
                borderTopEndRadius: program.pics?0:8,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                padding: 16
            }}
            colors={[program.backgroundColor1?program.backgroundColor1:appColors.background, program.backgroundColor2?program.backgroundColor2:program.backgroundColor1?program.backgroundColor1:appColors.lightPurple]}>
                <View style={appStyles.rowCenter}>
                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                        {
                            program.subject1 &&
                            <Text style={appStyles.greenBorder}>{program.subject1}</Text>
                        }
                    </View>
                    <View style={{flex: 1}}>
                        { program.des1 && <Text style={{color: appColors.white}}>{program.des1}</Text> }
                    </View>
                </View>
                <View style={[appStyles.rowCenter, {marginTop: 8}]}>
                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                        { program.subject2 && <Text style={appStyles.greenBorder}>{program.subject2}</Text> }
                    </View>
                    <View style={{flex: 1}}>
                        { program.des2 && <Text style={{color: appColors.white}}>{program.des2}</Text> }
                    </View>
                </View>
        </LinearGradient>
        {
            program.percentage == 100?
            <Image
                source={images.completed}
                style={{
                    position: 'absolute',
                    width: WIDTH(70),
                    height: WIDTH(20),
                    right: 0,
                    top: 40,
                }}
            />
            :
            <Image
                source={images.ongoing}
                style={{
                    position: 'absolute',
                    width: WIDTH(70),
                    height: WIDTH(20),
                    right: 8,
                    top: 40,
                }}
            />
        }
        {
            program.icon &&
            <Image
                style={{
                    position: 'absolute',
                    left: -10,
                    top: 56,
                    // resizeMode: 'contain',
                    width: WIDTH(85),
                    height: WIDTH(25)
                }}
                source={{uri: imageBase+program.icon}} />
        }
    </View>
)
}
export function FlagshipsScrees() {
    const {HEIGHT, appStyles, WIDTH} = useDesignScale()
    const [programs, setPrograms] = useState<IProgram[]>()
    useEffect(()=>{
        apiPrograms().then(res=>{
            setPrograms(res)
        })
    }, [])
    return (
        <GradientListContainer>
            <View style={{flex: 1, marginVertical: 16, marginHorizontal: 4}}>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={[appStyles.menuTitle, {marginEnd: 12}]}>Flagship Program</Text>
                </View>
                {
                    programs?.map(program=>{
                        return (
                            <FlagshipProgramItem
                                key={program.id}
                                program={program}/>
                        )
                    })
                }
            </View>
        </GradientListContainer>
    )
}

function WIDTH(arg0: number): string | number | undefined {
    throw new Error('Function not implemented.')
}
