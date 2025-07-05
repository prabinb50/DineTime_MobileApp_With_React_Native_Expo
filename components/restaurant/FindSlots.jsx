import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import { db } from '../../config/firebaseConfig';
import { Formik } from 'formik';
import guestFormSchema from '../../utils/guestFormSchema';
import Ionicons from '@expo/vector-icons/Ionicons';

const FindSlots = ({ date, slots, selectedSlot, setSelectedSlot, selectedNumber, restaurant }) => {
    // state to manage the visibility of the slots panel
    const [slotsVisible, setSlotsVisible] = useState(false);

    // state to manage the visibility of the modal
    const [modalVisible, setModalVisible] = useState(false);

    // state to manage the visibility of the booking form
    const [formVisible, setFormVisible] = useState(false);

    // function to handle the press event of the Find Slots button
    const handlePress = () => {
        // toggle the visibility of the slots
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

        // get the guest status from AsyncStorage
        const guestStatus = await AsyncStorage.getItem("isGuest");

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
        } else if (guestStatus === "true") {
            setFormVisible(true); // show the booking form for guest users

            setModalVisible(true); // show the modal for guest users
        }
    }

    // function to handle the modal visibility
    const handleModal = () => {
        setModalVisible(false); // hide the modal
    }

    // function to handle the form submission for guest users
    const handleFormSubmit = async (values) => {
        try {
            // add a new booking document to the "bookings" collection in firestore
            await addDoc(collection(db, "bookings"), {
                ...values,
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

            // reset the selected slot, and hide the slots pannel and modal after booking
            setSelectedSlot(null);
            setSlotsVisible(false);
            setModalVisible(false);
        } catch (error) {
            console.log("Error while booking:", error);
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

            {/* Modal for guest users to fill booking form */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType='slide'
                style={{ flex: 1, justifyContent: 'flex-end', margin: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
                <View className="flex-1 bg-[#00000080] justify-end">
                    <View className="bg-[#474747] rounded-t-lg mx-4 p-4 pb-6">
                        {
                            formVisible && (
                                <Formik
                                    initialValues={{ fullName: "", phoneNumber: "" }}
                                    validationSchema={guestFormSchema}
                                    onSubmit={handleFormSubmit}>
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                        <View className="w-full">
                                            <View>
                                                <Ionicons
                                                    name='close-sharp'
                                                    size={30}
                                                    color={"#f49b33"}
                                                    onPress={handleModal}
                                                />
                                            </View>
                                            {/* name field */}
                                            <Text className="text-[#f49b33] mt-4 mb-2">Name</Text>
                                            <TextInput
                                                className="h-11 border border-white rounded px-2 text-white"
                                                onChangeText={handleChange("fullName")}
                                                value={values.fullName}
                                                onBlur={handleBlur("fullName")}
                                            />

                                            {/* name rrror message */}
                                            {errors.fullName && touched.fullName && (<Text className="text-red-500 text-xs mb-2">{errors.fullName}</Text>)}

                                            {/* phone number field */}
                                            <Text className="text-[#f49b33] mt-4 mb-2">Phone Number</Text>
                                            <TextInput
                                                className="h-11 border border-white rounded px-2 text-white"
                                                onChangeText={handleChange("phoneNumber")}
                                                value={values.phoneNumber}
                                                onBlur={handleBlur("phoneNumber")}
                                            />

                                            {/* phone number error message */}
                                            {errors.phoneNumber && touched.phoneNumber && (<Text className="text-red-500 text-xs mb-2">{errors.phoneNumber}</Text>)}

                                            {/* submit button */}
                                            <TouchableOpacity
                                                className="p-2 bg-[#f49b33] text-black rounded-lg mt-6"
                                                onPress={handleSubmit}>
                                                <Text className="text-lg font-semibold text-center">Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </Formik>
                            )
                        }
                    </View>
                </View>
            </Modal>
        </View>
    )
}


export default FindSlots;