import { View, Text, Image, Platform, ScrollView, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from "../../assets/images/dinetimelogo.png"
import homeBanner from "../../assets/images/homeBanner.png"
import { BlurView } from 'expo-blur'
import { restaurants } from '../../store/restaurants'

const Home = () => {

    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <Image
                resizeMode='cover'
                source={{ uri: item.image }}
                className="h-28 mt-2 mb-1 rounded-lg"
            />

            <Text className="">{item.name}</Text>
        </TouchableOpacity>
    )

    return (
        // SafeAreaView ensures content is displayed within the safe area boundaries of a device
        <SafeAreaView className="bg-[#2b2b2b] ">
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
                    className="mb-4 w-full h-52 items-center justify-center bg-[#2b2b2b]"
                    source={homeBanner}
                >
                    <BlurView intensity={Platform.OS === "android" ? 100 : 50} tint='dark' className="w-full p-4 shadow-lg">
                        <Text className="text-center font-bold text-white text-3xl">Dine with your family</Text>
                    </BlurView>
                </ImageBackground>

                {
                    restaurants.length > 0 ?
                        <FlatList
                            data={restaurants}
                            renderItem={renderItem}
                            horizontal
                            contentContainerStyle={{ padding: 16 }} showsHorizontalScrollIndicator={false}
                            scrollEnabled={true} />
                        :
                        <ActivityIndicator animating color={"#f49b33"} />
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home
