import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';

const Picker = (props) => {
  return (
    <View>
        <DropDownPicker
            placeholder='Dla kogo zadanie?'
            multiple={true}
            mode="BADGE"
            badgeColors={["#F9B2B2", "#FFC300", "lightblue" ]}
            badgeDotColors={["#FF0000", "#FF5733", "blue"]}
            min={0}
            open={props.openP}
            value={props.valueP}
            items={props.itemsP}
            setOpen={props.setOpenP}
            setValue={props.setValueP}
            setItems={props.setItemsP}
            dropDownContainerStyle={{ width: '90%'}}
            style={{ width:'90%' }}
        />
    </View>
  )
}

export default Picker

const styles = StyleSheet.create({})