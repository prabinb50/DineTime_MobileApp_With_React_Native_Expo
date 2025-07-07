import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { db } from '../../config/firebaseConfig';

const History = () => {

    const router = useRouter(); // hook to navigate between pages

    // state to hold user email 
    const [userEmail, setUserEmail] = useState(null);

    // state to hold bookings data
    const [bookings, setBookings] = useState([]);

    // state to manage loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // function to fetch user email from AsyncStorage
        const fetchUserEmail = async () => {
            // get user email from AsyncStorage
            const email = await AsyncStorage.getItem("userEmail");

            setUserEmail(email);
        };

        // call the fetcthUserEmail function
        fetchUserEmail();
    }, []);

    useEffect(() => {
        // function to fetch bookings from AsyncStorage
        const fetchBookings = async () => {
            // check if user's email is exists
            if (userEmail) {
                try {
                    // reference to the bookings collection in firestore
                    const bookingCollection = collection(db, "bookings");

                    // query to get bookings for the user
                    const bookingQuery = query(bookingCollection, where("email", "==", userEmail));

                    // get the bookings from Firestore
                    const bookingSnapshot = await getDocs(bookingQuery);

                    // map through the documents and get the data
                    // const bookingList = bookingSnapshot.docs.map((doc) => ({
                    //     id: doc.id,
                    //     ...doc.data(),
                    // }));
                    const bookingList = bookingSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,

                            // Format the date timestamp to a readable string
                            date: data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'No date',
                        };
                    });

                    // set the bookings state with the fetched data
                    setBookings(bookingList);

                    console.log("Bookings fetched successfully:", bookingList);

                } catch (error) {
                    console.log("Error fetching bookings:", error);

                    Alert.alert(
                        "Error",
                        "There was an error fetching your bookings. Please try again later.",
                        [{ text: "OK" }]
                    );
                }
            }

            // set loading to false after fetching bookings
            setLoading(false);
        };

        // call the fetchBookings function
        fetchBookings();
    }, [userEmail]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#2b2b2b]">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-lg">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#2b2b2b]">
            {
                userEmail ? (
                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="p-4 border-b border-[#fb9b33]">
                                <Text className="text-white text-lg font-bold mb-2">{item.restaurant}</Text>

                                <Text className="text-gray-300 text-sm mb-1">Date: {item.date}</Text>

                                <Text className="text-gray-300 text-sm mb-1">Slot: {item.slot}</Text>

                                <Text className="text-gray-300 text-sm mb-1">Guests: {item.guests}</Text>

                                <Text className="text-gray-300 text-sm mb-1">Email: {item.email}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-white text-lg">No bookings found.</Text>
                    </View>
                )
            }
        </SafeAreaView>
    )
}

export default History