import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import logo from "../../assets/images/dinetimelogo.png"
import emptyImg from "../../assets/images/Frame.png"
import { Formik } from "formik";
import validationSchema from "../../utils/authSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const SignIn = () => {
    const router = useRouter();

    // function to handle user login process
    const handleSignIn = async (values) => {
        try {
            // login the user using Firebase Authentication with provided email and password
            const userCredentials = await signInWithEmailAndPassword(auth, values.email, values.password);

            // extract the user object from signin response
            const user = userCredentials.user;

            // fetch the user document from Firestore using the user's unique ID
            const userDoc = await getDoc(doc(db, "users", user.uid));

            // check if the user document exists in Firestore or not 
            if (userDoc.exists()) {
                // if user document exists then store the user email in AsyncStorage
                await AsyncStorage.setItem("userEmail", values.email);

                // store a flag in AsyncStorage to indicate that the user is not a guest
                await AsyncStorage.setItem("isGuest", "false");

                // navigate to the home page after successful sign-in
                router.push("/home");
            } else {
                // if user document does not exist then alert the user
                Alert.alert("User Not Found!",
                    "No user found with this email. Please sign up.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.log("Error while logging up:", error);

            // case 1: alert for wrong password or wrong email
            if (error.code === "auth/invalid-credential") {
                Alert.alert("Login Failed!",
                    "The email or password you entered is incorrect. Please try again.",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert("Login Error!",
                    "An unexpected error occurred. Please try again later.",
                    [{ text: "OK" }]
                );
            }

        }
    };

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
                {/* Centered content with margin */}
                <View className="m-2 flex justify-center items-center">

                    {/* App Logo */}
                    <Image
                        source={logo}
                        style={{ width: 200, height: 100 }}
                    />

                    {/* Header Text */}
                    <Text className="text-lg text-center text-white font-bold mb-5">Let's get you started</Text>

                    {/* Container for the form */}
                    <View className="w-5/6">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignIn}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View className="w-full">
                                    {/* Email Input Field */}
                                    <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                                    <TextInput
                                        className="h-11 border border-white rounded px-2 text-white"
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")}
                                        value={values.email}
                                        onBlur={handleBlur("email")}
                                    />

                                    {/* Email Error Message */}
                                    {errors.email && touched.email && (<Text className="text-red-500 text-xs mb-2">{errors.email}</Text>)}

                                    {/* Password Input Field */}
                                    <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                                    <TextInput
                                        className="h-11 border border-white rounded px-2 text-white"
                                        secureTextEntry
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={handleBlur("password")}
                                    />

                                    {/* Password Error Message */}
                                    {errors.password && touched.password && (<Text className="text-red-500 text-xs mb-2">{errors.password}</Text>)}

                                    {/* Sign In Button */}
                                    <TouchableOpacity
                                        className="p-2 bg-[#f49b33] text-black rounded-lg mt-6"
                                        onPress={handleSubmit}>
                                        <Text className="text-lg font-semibold text-center">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>

                        {/* Navigation Links */}
                        <View className="flex justify-center items-center">

                            {/* Link to Sign Up Page */}
                            <TouchableOpacity onPress={() => router.push("/signup")} className="flex flex-row justify-center items-center mt-5 p-2">
                                <Text className="text-white font-semibold">Don't have an account? {" "}</Text>
                                <Text className="text-base font-semibold underline text-[#f49b33]">Sign Up</Text>
                            </TouchableOpacity>

                            {/* Divider Text */}
                            <Text className="text-center text-base font-semibold  text-white">
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
                                or{""}
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
                            </Text>

                            {/* Guest User Option */}
                            <TouchableOpacity onPress={handleGuestUser} className="flex flex-row justify-center items-center mt-2 p-2">
                                <Text className="text-white font-semibold">Be a {" "}</Text>
                                <Text className="text-base font-semibold underline text-[#f49b33]">Guest User</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Decorative Bottom Image */}
                <View className="flex-1">
                    <Image
                        source={emptyImg}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn
