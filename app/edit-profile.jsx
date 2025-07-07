import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
    // router for navigation
    const router = useRouter();

    // state for bio input
    const [bio, setBio] = useState('');

    // state for email input (just for display)
    const [email, setEmail] = useState('');

    // states for UI control
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // load user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // function to fetch user data from Firestore
    const fetchUserData = async () => {
        try {
            setLoading(true);

            // make sure we have a current user
            if (!auth.currentUser) {
                const storedEmail = await AsyncStorage.getItem("userEmail");
                if (!storedEmail) {
                    Alert.alert("Error", "You need to be logged in to edit your profile");
                    router.push("/signin");
                    return;
                }
            }

            // set current email (just for display)
            const currentEmail = auth.currentUser?.email || '';
            setEmail(currentEmail);

            // get user document from Firestore
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                // populate bio field with existing data
                setBio(userData.bio || '');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            Alert.alert("Error", "Failed to load your profile data");
        } finally {
            setLoading(false);
        }
    };

    // validate form fields
    const validateForm = () => {
        const newErrors = {};

        // bio validation
        if (!bio || bio.trim() === '') {
            newErrors.bio = "Bio is required";
        } else if (bio.length > 150) {
            newErrors.bio = "Bio must be 150 characters or less";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handle save button press
    const handleSave = async () => {
        // validate form first
        if (!validateForm()) return;

        try {
            setSaving(true);

            // get reference to user document
            const userRef = doc(db, "users", auth.currentUser.uid);

            // update bio in Firestore
            await updateDoc(userRef, {
                bio,
                updatedAt: new Date()
            });

            // reset bio field after successful save
            // setBio('');

            Alert.alert(
                "Success",
                "Your profile has been updated successfully",
                [{
                    text: "OK", onPress: () => {
                        router.push("/(tabs)/profile");
                    }
                }]
            );
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update your profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // show loading indicator while fetching data
    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
                <ActivityIndicator size="large" color="#f49b33" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#2b2b2b]">
            {/* gradient background */}
            <LinearGradient
                colors={['#3a3a3a', '#2b2b2b', '#1a1a1a']}
                className="absolute inset-0"
            />

            {/* header with back button */}
            <View className="flex-row items-center border-b border-gray-700 px-4 py-3">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-1 rounded-full bg-gray-800"
                >
                    <Ionicons name="arrow-back" size={24} color="#f49b33" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Edit Profile</Text>
            </View>

            {/* main content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5 pt-6">
                    {/* email field (read-only) */}
                    <View className="mb-8">
                        <Text className="text-[#f49b33] text-base mb-2 font-medium">Email Address</Text>
                        <TextInput
                            className="bg-[#3a3a3a] text-gray-400 px-4 py-3 rounded-lg border border-gray-700"
                            value={email}
                            editable={false}
                        />
                        <Text className="text-gray-500 text-xs mt-1">Email cannot be changed</Text>
                    </View>

                    {/* bio field */}
                    <View className="mb-6">
                        <Text className="text-[#f49b33] text-base mb-2 font-medium">Bio</Text>
                        <TextInput
                            className="bg-[#3a3a3a] text-white px-4 py-4 rounded-lg border border-gray-700 min-h-[100px] align-top"
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            placeholderTextColor="#888"
                            multiline
                            textAlignVertical="top"
                            maxLength={150}
                        />
                        <Text className="text-gray-400 text-xs mt-1 text-right">
                            {bio ? `${bio.length}/150` : '0/150'} characters
                        </Text>
                        {errors.bio && (
                            <Text className="text-red-500 text-xs mt-1">{errors.bio}</Text>
                        )}
                    </View>

                    {/* save button */}
                    <TouchableOpacity
                        className={`bg-[#f49b33] py-4 rounded-lg mb-8 flex-row justify-center items-center ${saving || !bio.trim() ? 'opacity-50' : ''}`}
                        onPress={handleSave}
                        disabled={saving || !bio.trim()}
                    >
                        {saving ? (
                            <>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text className="text-white font-bold ml-2">Saving...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="#fff" />
                                <Text className="text-white font-bold ml-2">Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* divider */}
                    <View className="flex-row items-center mb-6">
                        <View className="flex-1 h-[1px] bg-gray-700" />
                        <Text className="text-gray-500 mx-2">Additional Options</Text>
                        <View className="flex-1 h-[1px] bg-gray-700" />
                    </View>

                    {/* change password button */}
                    <TouchableOpacity
                        className="flex-row items-center py-4 bg-[#3a3a3a] rounded-lg px-4 mb-16"
                        onPress={() => router.push('/change-password')}
                    >
                        <Ionicons name="key-outline" size={20} color="#f49b33" />
                        <Text className="text-white ml-2">Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color="#777" className="ml-auto" />
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;