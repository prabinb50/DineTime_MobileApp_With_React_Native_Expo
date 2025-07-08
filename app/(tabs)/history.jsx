import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

const History = () => {
    // hook to navigate between pages
    const router = useRouter();

    // state to hold user email 
    const [userEmail, setUserEmail] = useState(null);

    // state to hold bookings data
    const [bookings, setBookings] = useState([]);

    // state to manage loading state
    const [loading, setLoading] = useState(true);

    // state to track if data is being refreshed
    const [refreshing, setRefreshing] = useState(false);

    // function to get status color based on booking date
    const getStatusColor = (dateString) => {
        try {
            // parse the date string
            const bookingDate = new Date(dateString);
            const today = new Date();

            // strip time part to compare only dates
            today.setHours(0, 0, 0, 0);
            bookingDate.setHours(0, 0, 0, 0);

            // determine if booking is upcoming, today, or past
            if (bookingDate > today) {
                return { text: 'Upcoming', color: '#4CAF50' };
            } else if (bookingDate.getTime() === today.getTime()) {
                return { text: 'Today', color: '#FFC107' };
            } else {
                return { text: 'Past', color: '#9E9E9E' };
            }
        } catch (error) {
            return { text: 'Unknown', color: '#9E9E9E' };
        }
    };

    // function to format date in a more readable way
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'EEEE, MMMM do, yyyy');
        } catch (error) {
            return dateString || 'No date available';
        }
    };

    // fetch user email from AsyncStorage
    useEffect(() => {
        const fetchUserEmail = async () => {
            // get user email from AsyncStorage
            const email = await AsyncStorage.getItem("userEmail");
            setUserEmail(email);
        };

        // call the fetchUserEmail function
        fetchUserEmail();
    }, []);

    // function to fetch bookings from Firestore
    const fetchBookings = useCallback(async () => {
        // check if user's email exists
        if (!userEmail) {
            setLoading(false);
            return;
        }

        try {
            setRefreshing(true);

            // reference to the bookings collection in firestore
            const bookingCollection = collection(db, "bookings");

            // query to get bookings for the user
            const bookingQuery = query(bookingCollection, where("email", "==", userEmail));

            // get the bookings from Firestore
            const bookingSnapshot = await getDocs(bookingQuery);

            // map through the documents and get the data with better date formatting
            const bookingList = bookingSnapshot.docs.map((doc) => {
                const data = doc.data();
                // format the date from timestamp
                const formattedDate = data.date
                    ? new Date(data.date.seconds * 1000).toISOString().split('T')[0]
                    : 'No date';

                return {
                    id: doc.id,
                    ...data,
                    date: formattedDate,
                };
            });

            // sort bookings by date (newest first)
            bookingList.sort((a, b) => {
                if (!a.date || a.date === 'No date') return 1;
                if (!b.date || b.date === 'No date') return -1;
                return new Date(b.date) - new Date(a.date);
            });

            // set the bookings state with the fetched data
            setBookings(bookingList);
        } catch (error) {
            console.log("Error fetching bookings:", error);

            Alert.alert(
                "Error",
                "There was an error fetching your bookings. Please try again later.",
                [{ text: "OK" }]
            );
        } finally {
            // set loading and refreshing to false after fetching bookings
            setLoading(false);
            setRefreshing(false);
        }
    }, [userEmail]);

    // call the fetchBookings function when the component renders or user's email changes
    useEffect(() => {
        fetchBookings();
    }, [userEmail, fetchBookings]);

    // function to handle refreshing the bookings list
    const handleRefresh = () => {
        fetchBookings();
    };

    // show loading spinner while initially loading data
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#2b2b2b]">
                {/* gradient background */}
                <LinearGradient
                    colors={['#3a3a3a', '#2b2b2b', '#1a1a1a']}
                    className="absolute inset-0"
                />

                {/* loading indicator */}
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#f49b33" />
                    <Text className="text-white text-base mt-4">Loading your bookings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#2b2b2b]">
            {/* gradient background */}
            <LinearGradient
                colors={['#3a3a3a', '#2b2b2b', '#1a1a1a']}
                className="absolute inset-0"
            />

            {userEmail ? (
                <>
                    {/* header section - only visible to logged in users */}
                    <View className="px-5 py-4 border-b border-gray-800">
                        <Text className="text-white text-2xl font-bold">Booking History</Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            You can view your past, present, and future bookings here.
                        </Text>
                    </View>

                    {/* bookings list or empty state for logged in users */}
                    {bookings.length > 0 ? (
                        <FlatList
                            data={bookings}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 16 }}
                            ItemSeparatorComponent={() => <View className="h-4" />}
                            onRefresh={handleRefresh}
                            refreshing={refreshing}
                            renderItem={({ item }) => {
                                // get status info for the booking
                                const status = getStatusColor(item.date);

                                return (
                                    <View className="bg-[#333333] rounded-xl overflow-hidden shadow-lg">
                                        {/* restaurant name header with status badge */}
                                        <View className="px-4 py-3 border-b border-gray-700 flex-row justify-between items-center">
                                            <Text className="text-white text-lg font-bold">{item.restaurant}</Text>

                                            <View style={{ backgroundColor: `${status.color}20` }} className="px-3 py-1 rounded-full">
                                                <Text style={{ color: status.color }} className="text-xs font-medium">
                                                    {status.text}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* booking details  */}
                                        <View className="p-4 pb-5">
                                            {/* date info */}
                                            <View className="flex-row items-center mb-3">
                                                <View className="w-8 h-8 bg-[#f49b33] rounded-full items-center justify-center mr-3">
                                                    <Ionicons name="calendar" size={18} color="white" />
                                                </View>

                                                <View>
                                                    <Text className="text-gray-400 text-xs">Date</Text>
                                                    <Text className="text-white text-sm">{formatDate(item.date)}</Text>
                                                </View>
                                            </View>

                                            {/* time slot info */}
                                            <View className="flex-row items-center mb-3">
                                                <View className="w-8 h-8 bg-[#f49b33] rounded-full items-center justify-center mr-3">
                                                    <Ionicons name="time" size={18} color="white" />
                                                </View>

                                                <View>
                                                    <Text className="text-gray-400 text-xs">Time Slot</Text>
                                                    <Text className="text-white text-sm">{item.slot}</Text>
                                                </View>
                                            </View>

                                            {/* guests info */}
                                            <View className="flex-row items-center mb-3">
                                                <View className="w-8 h-8 bg-[#f49b33] rounded-full items-center justify-center mr-3">
                                                    <Ionicons name="people" size={18} color="white" />
                                                </View>

                                                <View>
                                                    <Text className="text-gray-400 text-xs">Guests</Text>
                                                    <Text className="text-white text-sm">{item.guests} {parseInt(item.guests) === 1 ? 'person' : 'people'}</Text>
                                                </View>
                                            </View>

                                            {/* email info  */}
                                            <View className="flex-row items-center">
                                                <View className="w-8 h-8 bg-[#f49b33] rounded-full items-center justify-center mr-3">
                                                    <Ionicons name="mail" size={18} color="white" />
                                                </View>

                                                <View>
                                                    <Text className="text-gray-400 text-xs">Email</Text>
                                                    <Text className="text-white text-sm">{item.email}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                        // ListEmptyComponent={
                        //     // this renders when user is logged in but has no bookings
                        //     <View className="flex-1 items-center justify-center py-20">
                        //         {/* <Image
                        //             source={require('../../assets/images/icon.png')}
                        //             style={{ width: 80, height: 80, opacity: 0.5 }}
                        //         /> */}
                        //         <Text className="text-white text-lg mt-4">No bookings yet</Text>
                        //         <Text className="text-gray-400 text-sm mt-2 text-center px-10">
                        //             Your restaurant reservations will appear here once you make them
                        //         </Text>
                        //         <TouchableOpacity
                        //             className="mt-6 bg-[#f49b33] px-6 py-3 rounded-full"
                        //             onPress={() => router.push('/(tabs)/home')}
                        //         >
                        //             <Text className="text-white font-semibold">Browse Restaurants</Text>
                        //         </TouchableOpacity>
                        //     </View>
                        // }
                        />
                    ) : (
                        // this renders when user is logged in but has no bookings 
                        <View className="flex-1 items-center justify-center p-8">
                            <Text className="text-white text-xl mt-4 font-semibold">No bookings yet</Text>
                            <Text className="text-gray-400 text-sm mt-2 text-center">
                                Your restaurant reservations will appear here once you make them
                            </Text>
                            <TouchableOpacity
                                className="mt-6 bg-[#f49b33] px-6 py-3 rounded-full"
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text className="text-white font-semibold">Browse Restaurants</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            ) : (
                // this renders when user is not logged in 
                <View className="flex-1 items-center justify-center p-8">
                    <View className="bg-[#3a3a3a] p-6 rounded-2xl items-center w-full max-w-sm">
                        <View className="w-16 h-16 bg-[#f49b33] rounded-full items-center justify-center mb-4">
                            <Ionicons name="lock-closed" size={28} color="white" />
                        </View>

                        <Text className="text-white text-xl font-bold">Sign in to view bookings</Text>

                        <Text className="text-gray-300 text-sm mt-3 text-center">
                            Please sign in to view your booking history and manage your reservations
                        </Text>

                        <TouchableOpacity
                            className="mt-6 bg-[#f49b33] w-full py-3 rounded-lg"
                            onPress={() => router.push('/signin')}
                        >
                            <Text className="text-white font-semibold text-center">Sign In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mt-3 border border-gray-600 w-full py-3 rounded-lg"
                            onPress={() => router.push('/signup')}
                        >
                            <Text className="text-gray-300 font-medium text-center">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default History;