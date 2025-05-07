import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import logo from "../../assets/images/dinetimelogo.png"
import emptyImg from "../../assets/images/Frame.png"
import { Formik } from "formik";
import validationSchema from "../../utils/authSchema";

const SignUp = () => {
    const router = useRouter();

    const handleSignUp = () => { };

    return (
        <SafeAreaView className="bg-[#2b2b2b]">
            <StatusBar barStyle={"light-content"} />
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="m-2 flex justify-center items-center">
                    <Image
                        source={logo}
                        style={{ width: 200, height: 100 }}
                    />

                    <Text className="text-lg text-center text-white font-bold mb-5">Let's get you started</Text>

                    <View className="w-5/6">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignUp}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View className="w-full">
                                    <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                                    <TextInput
                                        className="h-10 border border-white rounded px-2 text-white"
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")}
                                        value={values.email}
                                        onBlur={handleBlur("email")}
                                    />
                                    {errors.email && touched.email && (<Text className="text-red-500 text-xs mb-2">{errors.email}</Text>)}

                                    <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                                    <TextInput
                                        className="h-10 border border-white rounded px-2 text-white"
                                        secureTextEntry
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={handleBlur("password")}
                                    />
                                    {errors.password && touched.password && (<Text className="text-red-500 text-xs mb-2">{errors.password}</Text>)}

                                    <TouchableOpacity
                                        className="p-2 bg-[#f49b33] text-black rounded-lg mt-6"
                                        onPress={handleSubmit}>
                                        <Text className="text-lg font-semibold text-center">Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>

                        <View >
                            <TouchableOpacity onPress={() => router.push("/signin")} className="flex flex-row justify-center items-center my-5 p-2">
                                <Text className="text-white font-semibold">Already a User? {" "}</Text>

                                <Text className="text-base font-semibold underline text-[#f49b33]">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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

export default SignUp