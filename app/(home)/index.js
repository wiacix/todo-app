import { Pressable, ScrollView, Text, View, StatusBar, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite'

const index = () => {
    const db = SQLite.openDatabase('LocalDataBase.db');
    const WindowHeight = useWindowDimensions().height - (StatusBar.currentHeight || 0);
    const router = useRouter();
    const [user, setUser] = useState([]);

    useEffect(() => {
    db.transaction(tx => {
        tx.executeSql("SELECT * FROM Account", [], 
        (txObj, {rows}) => setUser(rows._array),
        (txObj, error) => console.log('ERROR - ', error)
        );
    })
    }, [])
    return (
        <ScrollView style={{ flex: 1}}>
        <LinearGradient colors={["#a89eea", "#f1d5ed"]} style={{ flex: 1, height: WindowHeight }}>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5, marginTop:7}}>
                <Entypo name="check" size={45} color="#120907" />
                <Text style={{fontSize:20, fontWeight:600, color: '#120907'}}>TO DO APP</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text style={{ color: '#242b4f', fontSize:23, marginLeft: 10, fontWeight: 600}}>{
                    user.map((index) => {
                        return (index.nazwa);
                    })
                }</Text>
            </View>
            <Pressable 
            style={{ backgroundColor: '#282846', width: 60, height: 60, justifyContent: 'center', alignItems:'center', borderRadius:100, bottom:15, right:15, position:'absolute'}}
            onPress={() => router.push("/(home)/addTask")}>
                <AntDesign name="plus" size={44} color="white" />
            </Pressable>
        </LinearGradient>
        </ScrollView>
    )
}

export default index
