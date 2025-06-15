import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

const DataPicker = () => {
    // State to manage the visibility of the DateTimePicker
    const [show, setShow] = useState(false);

    // State to hold the selected date
    const [date, setDate] = useState(new Date());

    // Function to handle date change
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    }

    // Function to handle the press event
    const handlePress = () => {
        setShow(true);
    }

    return (
        <View className="flex flex-row p-2">
            <TouchableOpacity onPress={handlePress} className={`rounded-lg text-base text-white ${Platform.OS === "android" && "px-2 py-1 justify-center bg-[#474747]"}`}>
                {Platform.OS === "android" && (
                    <Text className="px-2 py-1 bg-[#474747] text-white">{date.toLocaleDateString()}</Text>
                )}

                {Platform.OS === "android" && show && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                        accentColor='#f49b33'
                        textColor='#f49b33'
                        onChange={onChange}
                    />
                )}

                {Platform.OS === "ios" && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                        accentColor='#f49b33'
                        textColor='#f49b33'
                        onChange={onChange}
                    />
                )}
            </TouchableOpacity>

        </View>
    )
}

export default DataPicker