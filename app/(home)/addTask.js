import { ScrollView, View, StatusBar, useWindowDimensions, Pressable, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const addTask = () => {
    const WindowHeight = useWindowDimensions().height - (StatusBar.currentHeight || 0);
    const router = useRouter();

    return (
        <ScrollView style={{ flex: 1}}>
        <LinearGradient colors={["#a89eea", "#f1d5ed"]} style={{ flex: 1, height: WindowHeight }}>
            <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Pressable onPress={() => router.push("/(home)")}>
                    <Ionicons name="return-down-back" size={35} color='#120907' />
                </Pressable>
                <Text>Add Task</Text>
            </View>
        </LinearGradient>
        </ScrollView>
    )
}

export default addTask