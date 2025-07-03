import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Linking, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import DataPicker from '../../components/restaurant/DataPicker';
import GuestPicker from '../../components/restaurant/GuestPicker';
import FindSlots from '../../components/restaurant/FindSlots';

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
                setSlotsData(slots[0]?.slot);
            }
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }

    // Fetch restaurant data when the component mounts
    useEffect(() => {
        getRestaurantData();
    }, []);

    // Reference to the FlatList for scrolling
    const flatListRef = useRef(null);

    // Get the width of the device window for carousel item sizing
    const windowWidth = Dimensions.get('window').width;

    // State to manage the current index of the carousel
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to handle next image in the carousel
    const handleNextImage = () => {
        // If the current index is less than the last image, increment the index and scroll to the next image
        if (currentIndex < carouselData[0]?.images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
        }

        // If the current index is the last image, reset to the first image
        if (currentIndex === carouselData[0]?.images.length - 1) {
            setCurrentIndex(0);
            flatListRef.current.scrollToIndex({ index: 0, animated: true });
        }
    };

    // Function to handle previous image in the carousel
    const handlePreviousImage = () => {
        // If the current index is greater than 0, decrement the index and scroll to the previous image
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
        }
    };

    // Function to render each item in the carousel
    const carouselItem = ({ item }) => {
        return (
            // View container for each carousel item
            <View style={{ width: windowWidth - 2 }} className="h-64 relative rounded-[25px]">
                {/* Overlay for next button  */}
                {currentIndex < (carouselData[0]?.images.length - 1) && (
                    <View style={{ position: "absolute", top: "50%", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 50, padding: 5, zIndex: 10, right: "6%" }}>
                        <Ionicons name="arrow-forward" size={24} color="white" onPress={handleNextImage} />
                    </View>
                )}

                {/* Overlay for previous button  */}
                {currentIndex > 0 && (
                    <View style={{ position: "absolute", top: "50%", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 50, padding: 5, zIndex: 10, left: "2%" }}>
                        <Ionicons name="arrow-back" size={24} color="white" onPress={handlePreviousImage} />
                    </View>
                )}

                {/* Dots for carousel navigation */}
                <View style={{ position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", left: "50%", transform: [{ translateX: -50 }], zIndex: 10, bottom: 15 }}>
                    {/* Render dots based on the number of images in the carousel */}
                    {carouselData[0]?.images.map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: currentIndex === index ? "#f49b33" : "rgba(255,255,255,0.5)",
                                marginHorizontal: 2
                            }}
                        />
                    ))}
                </View>

                {/* Image for the carousel item */}
                <Image
                    source={{ uri: item }}
                    style={{ opacity: 0.5, backgroundColor: "black", marginRight: 20, marginLeft: 5, borderRadius: 25 }}
                    className="h-64"
                />
            </View>
        )
    };

    // Function to handle navigation to the restaurant's location
    const handleLocation = async () => {
        // URL for Google Maps to get directions to the restaurant
        const url = "https://maps.app.goo.gl/WXq11BJTUKfCr3eX6";

        // Check if the device can open the URL
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            // Open the URL in the default browser or maps app
            await Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + url);
        }
    };

    // State to hold the selected date
    const [date, setDate] = useState(new Date());

    // State to hold the selected number of guests
    const [selectedNumber, setSelectedNumber] = useState(1);

    // State to hold the selected slot
    const [selectedSlot, setSelectedSlot] = useState(null);

    return (
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

                {/* Carousel section for restaurant images */}
                <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
                    <FlatList
                        ref={flatListRef}
                        data={carouselData[0]?.images}
                        renderItem={carouselItem}
                        horizontal
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 25 }}
                    />
                </View>

                {/* Restaurant details section */}
                <View className="flex-1 flex-row mt-2 p-2">
                    <Ionicons name="location-sharp" size={24} color="#f49b33" />

                    {/* Restaurant address and direction link */}
                    <Text className="max-w-[80%] text-white">
                        {/* Restaurant address */}
                        {restaurantData?.address} | {" "}

                        {/* Link to get directions */}
                        <Text className="underline flex items-center text-[#f49b33] italic font-semibold" onPress={handleLocation}>
                            Get Direction
                        </Text>
                    </Text>
                </View>

                {/* Restaurant opening and closing hours */}
                <View className="flex-1 flex-row p-2">
                    <Ionicons name="time" size={20} color="#f49b33" />

                    <Text className="max-w-[75%] mx-2 font-semibold text-white">
                        {restaurantData?.opening} - {restaurantData?.closing}
                    </Text>
                </View>

                {/* DataPicker and GuestPicker components */}
                <View className="flex-1 border m-2 p-2 border-[#f49b33] rounded">
                    {/* DataPicker component for selecting date and time */}
                    <View className="flex-1 flex-row p-2 m-2 items-center justify-between">
                        {/* Icon and label for date selection */}
                        <View className="flex flex-row">
                            <Ionicons name="calendar" size={20} color="#f49b33" />

                            <Text className="text-white mx-2 text-base">
                                Select Booking Date
                            </Text>
                        </View>

                        <DataPicker date={date} setDate={setDate}></DataPicker>
                    </View>

                    {/* GuestPicker component for selecting number of guests */}
                    <View className="flex-1 flex-row p-2 items-center justify-between bg-[#474747] rounded-lg m-2">
                        {/* Icon and label for guest selection */}
                        <View className="flex flex-row">
                            <Ionicons name="people" size={20} color="#f49b33" />

                            <Text className="text-white mx-2 text-base">
                                Select Number of Guests
                            </Text>
                        </View>

                        <GuestPicker selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber}></GuestPicker>
                    </View>
                </View>

                {/* FindSlots component for displaying available slots */}
                <View className="flex-1">
                    <FindSlots
                        slots={slotsData}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                        date={date}
                        selectedNumber={selectedNumber}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Restaurant;