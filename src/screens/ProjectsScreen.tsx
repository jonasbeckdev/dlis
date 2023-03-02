import { useDesignScale } from 'modules/hooks'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { GradientListContainer } from 'components'
import { IProject } from '../models/project'
import { imageBase } from 'modules/constants'
import { appColors } from '../assets/colors'
import { apiProjects } from 'modules/api'
import LinearGradient from 'react-native-linear-gradient'
import { images } from 'assets'

export function ProjectsScreen() {
    const {appStyles, WIDTH, HEIGHT} = useDesignScale()
    const [projects, setProjects] = useState<IProject[]>([])
    useEffect(()=>{
        apiProjects().then(projects=>{
            setProjects(projects)
        })
    }, [])
    return (
        <View style={{flex: 1}}>
        <GradientListContainer>
            <View style={{flex: 1, marginVertical: 16}}>
                <View style={{alignItems: 'flex-end', marginTop: 16}}>
                    <Text style={[appStyles.menuTitle, {marginEnd: 16}]}>Projects</Text>
                </View>
                {
                    projects.map(project=>{
                        return (
                            <LinearGradient
                                colors={[appColors.background, '#7DA17B']}
                                style={{
                                    borderRadius: 8,
                                    marginHorizontal: 8,
                                    marginTop: 16, backgroundColor: '#7DA17B'}} key={project.id}>
                                <FlatList
                                    horizontal
                                    ItemSeparatorComponent={()=><View style={{width: 8}}/>}
                                    keyExtractor={(item, index)=>index.toString()}
                                    data={project.pics}
                                    renderItem={({item: pic})=>{
                                        return (
                                            <Image source={{uri: imageBase+pic}}
                                                style={{
                                                    borderTopLeftRadius: 8, borderTopRightRadius: 8,
                                                    width: WIDTH(420), height: WIDTH(245)}}
                                                resizeMode='stretch'/>
                                        )
                                    }}/>
                                <View style={{
                                    borderBottomStartRadius: 8, borderBottomEndRadius: 8,
                                    alignItems: 'center', backgroundColor: '#7DA17B'}}>
                                    <Text style={[appStyles.greenBorder, {marginTop: 8}]}>{project.name}</Text>
                                    <Text style={[appStyles.greenBorder, {marginVertical: 8, backgroundColor: appColors.transparent}]}>{project.location}</Text>
                                </View>
                                {
                                    project.status == 1 &&
                                    <Image
                                        source={images.ongoing}
                                        style={{
                                            position: 'absolute',
                                            width: WIDTH(70),
                                            height: WIDTH(20),
                                            right: 0,
                                            top: 10,
                                        }}
                                    />
                                }
                                {
                                    project.status == 2 &&
                                    <Image
                                        source={images.completed}
                                        style={{
                                            position: 'absolute',
                                            width: WIDTH(70),
                                            height: WIDTH(20),
                                            right: 8,
                                            top: 10,
                                        }}
                                    />
                                }
                            </LinearGradient>
                        )
                    })
                }
            </View>
        </GradientListContainer>
        <Image
            source={images.project}
            style={{
                position: 'absolute',
                width: WIDTH(100),
                height: WIDTH(26),
                left: -10,
                top: WIDTH(150),
            }}
        />
        </View>
    )
}