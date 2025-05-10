import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import emptyImg from "../assets/images/Frame.png";

export default function Index() {
  const router = useRouter(); // Hook to navigate between routes

  return (
    <SafeAreaView className="bg-[#2b2b2b]">
      {/* Setting the status bar style */}
      <StatusBar barStyle={"light-content"} />
      {/* Scrollable container with full height */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* Centered container for logo and buttons */}
        <View className="m-2 flex justify-center items-center">
          <Image
            source={logo}
            style={{ width: 300, height: 300 }} />

          {/* Container for buttons */}
          <View className="w-3/4">
            {/* Sign Up Button */}
            <TouchableOpacity className="p-2 my-2 bg-[#f49b33] text-black rounded-lg">
              <Text className="text-lg font-semibold text-center" onPress={() => router.push("/signup")}>Sign Up</Text>
            </TouchableOpacity>

            {/* Guest User Button */}
            <TouchableOpacity className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] text-black rounded-lg max-w-fit">
              <Text className="text-lg font-semibold text-center text-[#f49b33]" onPress={() => router.push("/home")}>Guest User</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider and Sign In Section */}
        <View>
          <Text className="text-center text-base font-semibold my-4 text-white">
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> {/* Left divider */}
            or{""}
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> {/* Right divider */}
          </Text>

          {/* Sign In Link */}
          <TouchableOpacity onPress={() => router.push("/signin")} className="flex flex-row justify-center items-center">
            <Text className="text-white font-semibold">Already a User? {" "}</Text>
            <Text className="text-base font-semibold underline text-[#f49b33]">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Empty image  */}
        <View className="flex-1">
          <Image
            source={emptyImg}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
