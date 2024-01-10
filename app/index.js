import { Pressable, StatusBar, Text, TextInput, View, useWindowDimensions, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import * as SQLite from 'expo-sqlite'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Loading from './(home)/Loading';

export default function index() {

  const db = SQLite.openDatabase('LocalDataBase.db');
  const [user, setUser] = useState([]);
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [nazwa, setNazwa] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const WindowHeight = useWindowDimensions().height - (StatusBar.currentHeight || 0);
  
  const checkUser = () => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM Account LIMIT 1", null, 
      (txObj, resultSet) => setUser(resultSet.rows._array),
      (txObj, error) => console.log('ERROR - ', error)
      );
  })}

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("DROP TABLE Account")
    })
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Account (id INTEGER PRIMARY KEY AUTOINCREMENT, imie TEXT, nazwisko TEXT, nazwa TEXT)')
    });

    checkUser();

    setIsLoading(false);
  }, []);

  const AddUser = async () => {
    if(imie && nazwisko && nazwa){
      const data = {
        imie: imie,
        nazwisko: nazwisko,
        nazwa: nazwa
      }
      axios.post("http://192.168.0.116/API/index.php?action=add_user", data).then((response) => {
        ToastAndroid.show(response.data, ToastAndroid.SHORT);
        db.transaction(tx => {
          tx.executeSql('INSERT INTO Account (imie, nazwisko, nazwa) VALUES (?, ?, ?)', [imie, nazwisko, nazwa],
          (txObj, error) => {
            checkUser();
        })})

      }).catch((error) => {
        console.log(error);
        ToastAndroid.show('Nie udało się dodać użytkownika na serwer.', ToastAndroid.LONG);
        setIsLoading(false);
      })

    }else{
      ToastAndroid.show('Aby się zalogować musisz podać wszystkie dane.', ToastAndroid.LONG);
      setIsLoading(false);
    }
  }

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      AddUser();
    }, 500)
  }


  return (
    (user.length < 1) ? (
      <View style={{ flex: 1}}>
        <LinearGradient colors={["#a89eea", "#f1d5ed"]} style={{ flex: 1, height: WindowHeight }}>
          <View style={{ justifyContent: 'center', alignItems:'center', flex: 1}}>
          <Text style={{ marginBottom:20, fontSize:24, textAlign:'center', fontWeight: 600, color:'#282846'}}>Aby korzystać z aplikacji ToDoList należy utworzyć konto</Text>
            <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 5 }}>Imię</Text>
            <TextInput
            value={imie}
            onChangeText={(text) => setImie(text)}
            style={{ borderColor:"#120907", borderWidth:1, width: '90%', borderRadius: 10, textAlign: 'center', color:'#282846'}}
            placeholder='Podaj Imię...' />

            <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 5 }}>Nazwisko</Text>
            <TextInput
            value={nazwisko}
            onChangeText={(text) => setNazwisko(text)}
            style={{ borderColor:"#120907", borderWidth:1, width: '90%', borderRadius: 10, textAlign: 'center', color:'#282846'}}
            placeholder='Podaj Nazwisko...' />

            <Text style={{fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 5 }}>Nazwa</Text>
            <TextInput
            value={nazwa}
            onChangeText={(text) => setNazwa(text)}
            style={{ borderColor:"#120907", borderWidth:1, width: '90%', borderRadius: 10, textAlign: 'center', color:'#282846'}}
            placeholder='Podaj Nazwe...' />

            <Pressable
              style={{ backgroundColor: "#62609750", width: '90%', marginTop: 20, height: 40, justifyContent:'center', alignItems:'center', borderRadius:10}}
              onPress={handleClick}>
              <Text style={{ fontSize: 18, fontWeight: 500, color: '#282846'}}>Utwórz konto</Text>
            </Pressable>
        </View>
        {isLoading && <Loading isLoading={isLoading} />}
        </LinearGradient>
        </View>
    ) : (
      <Redirect href="/(home)"/>
    )
  )
}