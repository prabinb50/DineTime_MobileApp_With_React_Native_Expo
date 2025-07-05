import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { auth } from '../../config/firebaseConfig';

const Profile = () => {
    // state to hold user email
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // function to fetch user's email from AsyncStorage
        const fetchUserEmail = async () => {
            // get email from AsyncStorage
            const email = await AsyncStorage.getItem("userEmail");

            setUserEmail(email);  // store it in state
        };

        fetchUserEmail(); // call the fetch function
    }, []);

    // function to handle user logout
    const handleLogout = async () => {
        try {
            // sign out the user from firebase authentication
            await signOut(auth);

            // remove user email from AsyncStorage
            await AsyncStorage.removeItem("userEmail");

            // clear the userEmail state
            setUserEmail(null);

            // show the message if user is logged out successfully
            Alert.alert("Logout Successful!",
                "You have been logged out successfully.",
                [{ text: "OK" }]
            );

            // navigate to the login page after logout
            router.push("/signin");
        } catch (error) {
            console.log("Error while logging out:", error);

            // show an alert in case of an error during logout
            Alert.alert("Logout Error!",
                "An unexpected error occurred while logging out. Please try again later.",
                [{ text: "OK" }]
            );
        }
    }

    const router = useRouter(); // hook to navigate between pages

    // function to handle signup navigation
    const handleSignUp = () => {
        router.push("/signup");
    }

    return (
        <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
            <Text className="text-xl text-[#f49b33] font-semibold mb-4">User Profile</Text>

            {
                userEmail ? (
                    <>
                        <Text className="text-white text-lg mb-6">Email: {userEmail}</Text>

                        <TouchableOpacity
                            className="p-2 bg-[#f49b33] text-black rounded-lg mt-6"
                            onPress={handleLogout}>
                            <Text className="text-lg font-semibold text-center">Logout</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            className="p-2 bg-[#f49b33] text-black rounded-lg mt-6"
                            onPress={handleSignUp}>
                            <Text className="text-lg font-semibold text-center">Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        </View>
    )
}

export default Profile