import { View } from 'react-native'
import React from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePicker = (props) => {
  return (
    <View>
      <DateTimePickerModal
        isVisible={props.isVisible}
        is24Hour={true}
        mode="datetime"
        date={props.date}
        onConfirm={props.onConfirmFun}
        onCancel={props.onCancleFun}
    />
    </View>
  )
}

export default DateTimePicker
