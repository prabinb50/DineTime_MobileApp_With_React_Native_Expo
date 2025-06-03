import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebaseConfig';

const Restaurant = () => {
    // Get restaurant name from URL params
    const { restaurant } = useLocalSearchParams();

    // State to store restaurant information
    const [restaurantData, setRestaurantData] = useState({});

    // State to store carousel images
    const [carouselData, setCarouselData] = useState({});

    // State to store available slots
    const [slotsData, setSlotsData] = useState({});

    // Function to fetch restaurant, carousel, and slot data from Firestore
    const getRestaurantData = async () => {
        try {
            // Query to find restaurant by name
            const restaurantQuery = query(collection(db, "restaurants"), where("name", "==", restaurant));

            const restaurantSnapshot = await getDocs(restaurantQuery);
            // If no restaurant is found, log and return early
            if (restaurantSnapshot.empty) {
                console.log("No matching restaurant found");
                return;
            }

            // Loop through the restaurant documents
            for (const doc of restaurantSnapshot.docs) {
                // Extract and store restaurant data
                const restaurantData = doc.data();
                setRestaurantData(restaurantData);

                // Fetch carousel images associated with this restaurant
                const carouselQuery = query(collection(db, "carousel"), where("res_id", "==", doc.ref));
                const carouselSnapshot = await getDocs(carouselQuery);
                const carouselImages = [];
                // If no carousel images are found, log and continue
                if (carouselSnapshot.empty) {
                    console.log("No carousel images found for this restaurant");
                }
                // collect carousel image data
                carouselSnapshot.forEach((carouselDoc) => {
                    carouselImages.push(carouselDoc.data());
                });
                setCarouselData(carouselImages);

                // Fetch available slots for this restaurant
                const slotsQuery = query(collection(db, "slots"), where("ref_id", "==", doc.ref));
                const slotsSnapshot = await getDocs(slotsQuery);
                const slots = [];
                // If no slots are found, log and continue
                if (slotsSnapshot.empty) {
                    console.log("No slots found for this restaurant");
                }
                // collect slot data
                slotsSnapshot.forEach((slotDoc) => {
                    slots.push(slotDoc.data());
                });
                setSlotsData(slots);
            }
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }

    // Fetch restaurant data when the component mounts
    useEffect(() => {
        getRestaurantData();
    }, []);

    return (
        // SafeAreaView with platform-specific padding
        <SafeAreaView
            style={[{ backgroundColor: "#2b2b2b" }, Platform.OS === "android" && { paddingBottom: 50 }, Platform.OS === "ios" && { paddingBottom: 20 }]}
        >
            {/* Scrollable container for restaurant content */}
            <ScrollView className="h-full">
                <View className="flex-1 my-2 p-2">
                    {/* Restaurant name display */}
                    <Text className="text-xl mr-2 font-semibold text-[#f49b33]">{restaurant}</Text>

                    {/* Horizontal divider */}
                    <View className="border-b border-[#f49b33]" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Restaurant;