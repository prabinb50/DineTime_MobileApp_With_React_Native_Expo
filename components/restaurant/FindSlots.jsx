import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

const FindSlots = ({ date, slots, selectedSlot, setSelectedSlot, selectedNumber }) => {
    // State to manage the visibility of the slots panel
    const [slotsVisible, setSlotsVisible] = useState(false);

    // Function to handle the press event of the Find Slots button
    const handlePress = () => {
        // Toggle the visibility of the slots
        setSlotsVisible(!slotsVisible);
    }

    // Function to handle the press event of a slot
    const handleSlotPress = (slot) => {
        let previousSlot = selectedSlot;

        // If the same slot is pressed again then deselect it
        if (previousSlot == slot) {
            setSelectedSlot(null);
        } else {
            // Otherwise select the new slot
            setSelectedSlot(slot);
        }
    }

    return (
        <View className="flex-1">
            <View className={`flex ${selectedSlot != null && "flex-row"}`}>
                {/* Find Slots button container */}
                <View className={`${selectedSlot != null && "flex-1"}`}>
                    <TouchableOpacity
                        onPress={handlePress}
                    >
                        <Text className="text-lg text-center font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                            Find Slots
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Book Slot button - only visible when a slot is selected */}
                {selectedSlot != null && (
                    <View className="flex-1">
                        <TouchableOpacity
                        >
                            <Text className="text-lg text-center font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg text-white">
                                Book Slot
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Slots panel - only visible when the Find Slots button is pressed */}
            {slotsVisible && (
                <View className="flex-wrap flex-row mx-2 p-2 rounded-lg bg-[#474747]">
                    {/* Map through all available slots */}
                    {slots.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""}`}
                            onPress={() => handleSlotPress(slot)}
                            disabled={selectedSlot == slot || selectedSlot == null ? false : true} // Disable if a slot is already selected
                        >
                            <Text className="text-white font-bold">
                                {slot}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    )
}

export default FindSlots