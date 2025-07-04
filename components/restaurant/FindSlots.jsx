import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { db } from '../../config/firebaseConfig';

const FindSlots = ({ date, slots, selectedSlot, setSelectedSlot, selectedNumber, restaurant }) => {
    // state to manage the visibility of the slots panel
    const [slotsVisible, setSlotsVisible] = useState(false);

    // function to handle the press event of the Find Slots button
    const handlePress = () => {
        // Toggle the visibility of the slots
        setSlotsVisible(!slotsVisible);
    }

    // function to handle the press event of a slot
    const handleSlotPress = (slot) => {
        let previousSlot = selectedSlot;

        // if the same slot is pressed again then deselect it
        if (previousSlot == slot) {
            setSelectedSlot(null);
        } else {
            // otherwise select the new slot
            setSelectedSlot(slot);
        }
    }

    // function to handle the booking process
    const handleBooking = async () => {
        // get the logged-in user's email from AsyncStorage
        const userEmail = await AsyncStorage.getItem("userEmail");

        // if user's email found then proceed with booking
        if (userEmail) {
            try {
                // add a new booking document to the "bookings" collection in Firestore
                await addDoc(collection(db, "bookings"), {
                    email: userEmail,
                    date: date,
                    slot: selectedSlot,
                    guests: selectedNumber,
                    restaurant: restaurant,
                    createdAt: new Date(),
                });

                // if booking is successful then show a success message to the user
                Alert.alert("Booking Successful!",
                    `Your slot for ${selectedSlot} on ${date} has been successfully booked.`,
                    [{ text: "OK" }]
                );

                // after booking then reset the selected slot and hide the slots panel 
                setSelectedSlot(null);
                setSlotsVisible(false);
            } catch (error) {
                console.log("Error while booking:", error);
            }
        }
    }

    return (
        <View className="flex-1">
            <View className={`flex ${selectedSlot != null && "flex-row"}`}>
                {/* find Slots button container */}
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
                        <TouchableOpacity onPress={handleBooking}
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
                    {/* map through all available slots */}
                    {slots.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""}`}
                            onPress={() => handleSlotPress(slot)}
                            disabled={selectedSlot == slot || selectedSlot == null ? false : true} // disable if a slot is already selected
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


export default FindSlots;