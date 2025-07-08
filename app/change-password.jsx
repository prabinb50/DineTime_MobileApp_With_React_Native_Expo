import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { auth } from '../config/firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePassword = () => {
    // router for navigation
    const router = useRouter();

    // state for password inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // states for password visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // states for UI control
    const [changing, setChanging] = useState(false);
    const [errors, setErrors] = useState({});

    // check if user is trying to change passworf
    const isChangingPassword = currentPassword.trim() || newPassword.trim() || confirmPassword.trim();

    // validate password fields
    const validateForm = () => {
        const newErrors = {}; // initialize an empty object for errors

        // validate current password
        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Current password is required";
        }

        // validate new password
        if (!newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one special character";
        }

        // validate confirm password
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // check if new password is different from current
        if (newPassword === currentPassword) {
            newErrors.newPassword = "New password must be different from current password";
        }

        setErrors(newErrors); // update errors state

        return Object.keys(newErrors).length === 0; // return true if no errors
    };

    // handle change password button press
    const handleChangePassword = async () => {
        // validate form first
        if (!validateForm()) return;

        try {
            setChanging(true);

            // make sure we have a current user
            if (!auth.currentUser) {
                Alert.alert("Error", "You need to be logged in to change your password");
                router.push("/signin");
                return;
            }

            // reauthenticate the user with their current password
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                currentPassword
            );

            // reauthenticate the user
            await reauthenticateWithCredential(auth.currentUser, credential);

            // update the password
            await updatePassword(auth.currentUser, newPassword);

            // show success message
            Alert.alert(
                "Success",
                "Your password has been changed successfully. Please sign in with your new password.",
                [{
                    text: "OK",
                    onPress: async () => {
                        // sign out user for security
                        await signOut(auth);
                        router.push("/signin");
                    }
                }]
            );
        } catch (error) {
            console.error("Error changing password:", error);

            // handle specific firebase errors
            if (error.code === 'auth/wrong-password') {
                setErrors({
                    ...errors,
                    currentPassword: "Incorrect password"
                });
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert(
                    "Too Many Attempts",
                    "Account temporarily disabled due to many failed login attempts. Try again later or reset your password."
                );
            } else if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                    "Session Expired",
                    "Please sign in again before changing your password.",
                    [{
                        text: "OK",
                        onPress: async () => {
                            await signOut(auth);
                            router.push("/signin");
                        }
                    }]
                );
            } else {
                Alert.alert(
                    "Error",
                    "Failed to change password. Please try again."
                );
            }
        } finally {
            setChanging(false);
        }
    };

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
                <Text className="text-white text-xl font-bold ml-4">Change Password</Text>
            </View>

            {/* main content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5 pt-6">
                    {/* security icon and heading */}
                    <View className="items-center mb-8">
                        <View className="bg-[#f49b33] p-4 rounded-full mb-4">
                            <Ionicons name="shield-checkmark" size={36} color="white" />
                        </View>
                        <Text className="text-white text-lg text-center font-medium">
                            Create a strong password to keep your account secure
                        </Text>
                    </View>

                    {/* current password field */}
                    <View className="mb-6">
                        <Text className="text-[#f49b33] text-base mb-2 font-medium">Current Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-[#3a3a3a] text-white px-4 py-3 rounded-lg border border-gray-700 pr-12"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter your current password"
                                placeholderTextColor="#888"
                                secureTextEntry={!showCurrentPassword}
                            />
                            <TouchableOpacity
                                className="absolute right-3 top-3"
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.currentPassword && (
                            <Text className="text-red-500 text-xs mt-1">{errors.currentPassword}</Text>
                        )}
                    </View>

                    {/* new password field */}
                    <View className="mb-6">
                        <Text className="text-[#f49b33] text-base mb-2 font-medium">New Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-[#3a3a3a] text-white px-4 py-3 rounded-lg border border-gray-700 pr-12"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter your new password"
                                placeholderTextColor="#888"
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                className="absolute right-3 top-3"
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && (
                            <Text className="text-red-500 text-xs mt-1">{errors.newPassword}</Text>
                        )}

                        {/* password requirements hint */}
                        <View className="mt-2 bg-[#2a2a2a] p-3 rounded-lg">
                            <Text className="text-gray-400 text-xs mb-1">Password requirements:</Text>

                            <View className="flex-row items-center mb-1">
                                <Ionicons
                                    name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                                    size={14}
                                    color={newPassword.length >= 8 ? "#4caf50" : "#888"}
                                />
                                <Text className="text-gray-400 text-xs ml-1">At least 8 characters</Text>
                            </View>

                            <View className="flex-row items-center mb-1">
                                <Ionicons
                                    name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                    size={14}
                                    color={/[A-Z]/.test(newPassword) ? "#4caf50" : "#888"}
                                />
                                <Text className="text-gray-400 text-xs ml-1">At least one uppercase letter</Text>
                            </View>

                            <View className="flex-row items-center mb-1">
                                <Ionicons
                                    name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                    size={14}
                                    color={/[0-9]/.test(newPassword) ? "#4caf50" : "#888"}
                                />
                                <Text className="text-gray-400 text-xs ml-1">At least one number</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Ionicons
                                    name={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                    size={14}
                                    color={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "#4caf50" : "#888"}
                                />
                                <Text className="text-gray-400 text-xs ml-1">At least one special character</Text>
                            </View>
                        </View>
                    </View>

                    {/* confirm password field */}
                    <View className="mb-8">
                        <Text className="text-[#f49b33] text-base mb-2 font-medium">Confirm New Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-[#3a3a3a] text-white px-4 py-3 rounded-lg border border-gray-700 pr-12"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your new password"
                                placeholderTextColor="#888"
                                secureTextEntry={!showConfirmPassword}
                            />

                            <TouchableOpacity
                                className="absolute right-3 top-3"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.confirmPassword && (
                            <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword}</Text>
                        )}
                    </View>

                    {/* security note */}
                    <View className="mb-8 bg-[#33302a] p-4 rounded-lg border border-[#f49b33] border-opacity-30">
                        <View className="flex-row">
                            <Ionicons name="information-circle-outline" size={20} color="#f49b33" />
                            <Text className="text-[#f49b33] font-medium text-sm ml-2">Security Note</Text>
                        </View>

                        <Text className="text-gray-300 text-xs mt-2">
                            For your security, you'll be signed out after changing your password. You'll need to sign in again with your new password.
                        </Text>
                    </View>

                    {/* change password button */}
                    <TouchableOpacity
                        className={`bg-[#f49b33] py-4 rounded-lg mb-8 flex-row justify-center items-center ${changing || !currentPassword || !newPassword || !confirmPassword ? 'opacity-50' : ''}`}
                        onPress={handleChangePassword}
                        disabled={changing || !currentPassword || !newPassword || !confirmPassword}
                    >
                        {changing ? (
                            <>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text className="text-white font-bold ml-2">Changing...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="key-outline" size={20} color="#fff" />
                                <Text className="text-white font-bold ml-2">Change Password</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* cancel button */}
                    {isChangingPassword && (
                        <TouchableOpacity
                            className="py-4 rounded-lg mb-16 flex-row justify-center items-center border border-gray-600"
                            onPress={() => router.back()}
                            disabled={changing}
                        >
                            <Text className="text-gray-300 font-medium">Cancel</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;

