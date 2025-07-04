import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import emptyImg from "../assets/images/Frame.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter(); // hook to navigate between routes

  // function to handle guest user login
  const handleGuestUser = async () => {
    // store a flag in AsyncStorage to indicate that the user is a guest
    await AsyncStorage.setItem("isGuest", "true"); 

    // navigate to the home page as a guest user
    router.push("/home"); 
  }

  return (
    <SafeAreaView className="bg-[#2b2b2b]">
      <StatusBar barStyle={"light-content"} />

      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* centered container for logo and buttons */}
        <View className="m-2 flex justify-center items-center">
          <Image
            source={logo}
            style={{ width: 300, height: 300 }} />

          {/* container for buttons */}
          <View className="w-3/4">
            {/* sign up button */}
            <TouchableOpacity className="p-2 my-2 bg-[#f49b33] text-black rounded-lg">
              <Text className="text-lg font-semibold text-center" onPress={() => router.push("/signup")}>Sign Up</Text>
            </TouchableOpacity>

            {/* guest user button */}
            <TouchableOpacity className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] text-black rounded-lg max-w-fit">
              <Text className="text-lg font-semibold text-center text-[#f49b33]" onPress={handleGuestUser}>Guest User</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* divider and sign in section */}
        <View>
          <Text className="text-center text-base font-semibold my-4 text-white">
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> {/* left divider */}
            or{""}
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> {/* right divider */}
          </Text>

          {/* sign in link */}
          <TouchableOpacity onPress={() => router.push("/signin")} className="flex flex-row justify-center items-center">
            <Text className="text-white font-semibold">Already a User? {" "}</Text>
            <Text className="text-base font-semibold underline text-[#f49b33]">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* empty image  */}
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
