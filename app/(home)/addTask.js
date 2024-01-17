import { ScrollView, View, StatusBar, useWindowDimensions, Pressable, Text, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { Ionicons, Fontisto, Feather } from '@expo/vector-icons';
import DateTimePicker from './DateTimePicker';
import Picker from './Picker';
import axios from 'axios';
import Loading from './Loading';
import * as SQLite from 'expo-sqlite';

const addTask = () => {
    const WindowHeight = useWindowDimensions().height - (StatusBar.currentHeight || 0);
    const db = SQLite.openDatabase('LocalDataBase.db');
    const router = useRouter();
    const [user, setUser] = useState([]);
    const [task, setTask] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* GetUsers to Picker */
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM Account", [], 
            (txObj, {rows}) => setUser(rows._array),
            (txObj, error) => console.log('ERROR - ', error)
            );
        })
        const GetData = async () => {
            try {
            const response = await axios.get("http://192.168.0.116/API/index.php?action=show_users");
            setData(response.data);
            } catch (error) {
            console.log('error - ', error);
            }
        };
        GetData();
    }, []);

    useMemo(() => {
        data.map((index) => {
            setItems((oldArray) => [...oldArray, {label: index.Nazwa, value: index.ID, key: index.ID}]);
        })
    }, [data])

    

    function addZero(temp){
        if(temp<10) return '0'+temp;
        else return temp;
    }

    
    /* DateTimePicker */
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [pickedDate, setPickedDate] = useState(new Date());
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        if(date>=(new Date())) setPickedDate(date);
        else{
            ToastAndroid.show('Błędna data', ToastAndroid.SHORT);
        }
        hideDatePicker();
    };

    /* Dodanie zadania do bazy danych */
    const addTask = async () => {
        if(task && pickedDate && value){
            let id;
            user.map((index) => {
                id = index.id
            })
            const date = {
                tresc: task,
                ID_od: id,
                ID_dla: value,
                termin: pickedDate
            }
            axios.post("http://192.168.0.116/API/index.php?action=add_task", date).then((response) => {
                ToastAndroid.show('Dodano zadanie.', ToastAndroid.LONG);
                setIsLoading(false);
                router.push("/(home)")
            }).catch((error) => {
                console.log(error);
                ToastAndroid.show('Nie udało się dodać zadania.', ToastAndroid.LONG);
                setIsLoading(false);
            })

        }else{
            ToastAndroid.show('Aby dodać zadanie musisz podać wszystkie dane.', ToastAndroid.LONG);
            setIsLoading(false);
        }
    }
    

    const handleClick = () => {
        setIsLoading(true);
        setTimeout(() => {
          addTask();
        }, 500)
      }
    

    return (
        <View style={{ flex: 1}}>
        <LinearGradient colors={["#a89eea", "#f1d5ed"]} style={{ flex: 1, height: WindowHeight }}>
            <View style={{ justifyContent:'center', alignItems:'center'}}>
                <Pressable onPress={() => router.push("/(home)")} style={{position:'absolute', left:5, top:2}}> 
                    <Ionicons name="return-down-back" size={45} color='#120907' />
                </Pressable>
                <Text style={{fontSize:20, fontWeight:600, color: '#120907', marginTop:10 }}>Add Task</Text>
            </View>
            <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 5 }}>Treść zadania</Text>
                <TextInput
                    multiline = {true}
                    numberOfLines={2}
                    value={task}
                    onChangeText={(text) => setTask(text)}
                    style={{ borderColor:"#120907", borderWidth:1, width: '90%', borderRadius: 10, textAlign: 'center', color:'#282846'}}
                    placeholder='Treść zadania...'
                />
                <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 15 }}>Dla kogo zadanie?</Text>
                <Picker
                    openP={open}
                    valueP={value}
                    itemsP={items}
                    setOpenP={setOpen}
                    setValueP={setValue}
                    setItemsP={setItems}
                />
                <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 15 }}>Termin zadania</Text>
                <Pressable
                    onPress={() => setDatePickerVisibility(true)}
                    style={{ borderColor: "#120907", borderWidth:1, borderRadius: 10, justifyContent:'center', alignItems:'center',flexDirection:'row', padding: 5, width:'90%'}}
                >
                    <Fontisto name="date" size={24} color="black" style={{ marginRight: 7}}/>
                    <Text>{addZero(pickedDate.getDate())+'.'+pickedDate.getMonth()+1+'.'+pickedDate.getFullYear()+' '+addZero(pickedDate.getHours())+':'+addZero(pickedDate.getMinutes())}</Text>
                </Pressable>
                <DateTimePicker
                    date = {pickedDate}
                    isVisible = {isDatePickerVisible}
                    onConfirmFun = {handleConfirm}
                    onCancleFun = {hideDatePicker}
                />
                <Pressable
                    onPress={handleClick}
                    style={{ borderColor: "#120907", borderWidth:1, borderRadius: 10, justifyContent:'center', alignItems:'center',flexDirection:'row', padding: 5, width:'90%', marginTop:30, backgroundColor:'#9889F965'}}
                >
                    <Feather name="check" size={30} color="black" style={{ marginRight: 7}} />
                    <Text style={{ fontWeight:600}}>Dodaj Zadanie</Text>
                </Pressable>
                {isLoading && <Loading isLoading={isLoading} />}
            </View>
        </LinearGradient>
        </View>
    )
}

export default addTask