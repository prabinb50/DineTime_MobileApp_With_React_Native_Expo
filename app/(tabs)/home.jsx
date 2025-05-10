import { View, Text, Image, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from "../../assets/images/dinetimelogo.png"

const Home = () => {
    return (
        <SafeAreaView className="bg-[#2b2b2b] ">
            <View className="flex items-center">
                <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex-row p-2">
                    <View className="flex flex-row">
                        <Text
                            className="text-base h-10 align-middle text-white"
                            style={{ paddingTop: Platform.OS === "android" ? 6.5 : 8 }}>{" "}
                            Welcome to{" "}</Text>

                        <Image
                            resizeMode='cover'
                            className="w-20 h-12"
                            source={logo}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home

// 2:07:21