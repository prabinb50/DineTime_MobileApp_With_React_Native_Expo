import { Text, TouchableOpacity, View } from 'react-native'

const GuestPicker = ({ selectedNumber, setSelectedNumber }) => {
    // Function to handle decrementing the guest count
    const decrement = () => {
        // Ensure the selected number does not go below 1
        if (selectedNumber > 1)
            setSelectedNumber(selectedNumber - 1);
    }

    // Function to handle incrementing the guest count
    const increment = () => {
        // Ensure the selected number does not exceed 8   
        if (selectedNumber < 8)
            setSelectedNumber(selectedNumber + 1);
    }

    return (
        <View className="flex flex-row items-center rounded-lg text-white text-base">
            {/* Decrement button */}
            <TouchableOpacity onPress={decrement} className="rounded">
                <Text className="text-white text-lg border border-[#f49b33] rounded-l-lg px-3">-</Text>
            </TouchableOpacity>

            {/* Display the selected number of guests */}
            <Text className="px-3 text-white bg-[#474747] text-lg border border-[#474747]">
                {selectedNumber}
            </Text>

            {/* Increment button */}
            <TouchableOpacity onPress={increment} className="rounded">
                <Text className="text-white text-lg border border-[#f49b33] rounded-r-lg px-3">+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default GuestPicker
