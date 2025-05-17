import { View, Text, Image, Platform, ScrollView, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from "../../assets/images/dinetimelogo.png"
import homeBanner from "../../assets/images/homeBanner.png"
import { BlurView } from 'expo-blur'
import { restaurants } from '../../store/restaurants'

const Home = () => {

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="bg-gradient-to-b from-[#706f6f] to-[#4d4d4d] h-full max-w-xs flex justify-center rounded-xl p-5 pt-7 mx-3 shadow-xl"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 8
            }}
        >
            <Image
                resizeMode='cover'
                source={{ uri: item.image }}
                className="h-36 w-full mt-1 mb-3 rounded-xl"
                style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' }}
            />

            <Text className="text-white text-xl font-bold mb-1">{item.name}</Text>

            <Text className="text-gray-300 text-sm mb-1 opacity-90">{item.address}</Text>

            <View className="flex-row justify-between mt-1 bg-[#3c3c3c] p-2 rounded-lg">
                <Text className="text-[#f49b33] text-sm">Opens: {item.opening}</Text>
                <Text className="text-[#f49b33] text-sm">Closes: {item.closing}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        // SafeAreaView ensures content is displayed within the safe area boundaries of a device
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" }, Platform.OS === "android" && { paddingBottom: 50 }, Platform.OS === "ios" && { paddingBottom: 20 }]}>
            <View className="flex items-center">
                {/* Container for the welcome message and logo */}
                <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex-row p-2">
                    <View className="flex flex-row">
                        {/* Welcome message */}
                        <Text
                            className="text-base h-10 align-middle text-white"
                            style={{ paddingTop: Platform.OS === "android" ? 6.5 : 8 }}>
                            {" "}Welcome to{" "}
                        </Text>

                        {/* Logo image */}
                        <Image
                            resizeMode='cover'
                            className="w-20 h-12"
                            source={logo}
                        />
                    </View>
                </View>
            </View>

            <ScrollView stickyHeaderIndices={[0]}>
                <ImageBackground
                    resizeMode='cover'
                    className=" w-full h-52 items-center justify-center bg-[#2b2b2b]"
                    source={homeBanner}
                >
                    <BlurView intensity={Platform.OS === "android" ? 100 : 50} tint='dark' className="w-full p-3 shadow-lg">
                        <Text className="text-center font-bold text-white text-3xl">Dine with your loved ones</Text>
                    </BlurView>
                </ImageBackground>

                <View className="pt-4 px-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-white text-3xl  font-semibold mr-2">Special Discount %</Text>
                </View>

                {
                    restaurants.length > 0 ? (
                        <FlatList
                            data={restaurants}
                            renderItem={renderItem}
                            horizontal
                            contentContainerStyle={{ padding: 16 }} showsHorizontalScrollIndicator={false}
                            scrollEnabled={true} />
                    ) : (
                        <ActivityIndicator animating color={"#f49b33"} />
                    )}

                <View className="pt-4 px-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-[#f49b33] text-3xl  font-semibold mr-2">Our Restaurants</Text>
                </View>

                {
                    restaurants.length > 0 ? (
                        <FlatList
                            data={restaurants}
                            renderItem={renderItem}
                            horizontal
                            contentContainerStyle={{ padding: 16 }} showsHorizontalScrollIndicator={false}
                            scrollEnabled={true} />
                    ) : (
                        <ActivityIndicator animating color={"#f49b33"} />
                    )}

            </ScrollView>
        </SafeAreaView>
    )
}

export default Home
