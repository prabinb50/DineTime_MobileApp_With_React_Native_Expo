import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, storage } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import uuid from 'uuid-random';

const Profile = () => {
    // state to hold user email
    const [userEmail, setUserEmail] = useState(null);

    // state to manage loading 
    const [loading, setLoading] = useState(true);

    // state to hold user data
    const [userData, setUserData] = useState(null);

    // state to hold profile image URL
    const [profileImage, setProfileImage] = useState(null);

    // state to manage image upload status
    const [uploading, setUploading] = useState(false);

    // state to manage image picker modal visibility
    const [imagePickerVisible, setImagePickerVisible] = useState(false);

    // state to hold bookings count
    const [bookingsCount, setBookingsCount] = useState(0);

    // hook to navigate between pages
    const router = useRouter();

    // function to fetch user data from firestore and AsyncStorage
    const fetchUserData = async () => {
        try {
            // get user email from AsyncStorage
            const email = await AsyncStorage.getItem("userEmail");
            setUserEmail(email);

            if (email && auth.currentUser) {
                // get user data from Firestore
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    // set profile image URL if it exists
                    if (userDoc.data().profileImageUrl) {
                        setProfileImage(userDoc.data().profileImageUrl);
                    }
                }

                // Fetch bookings count from Firestore
                await fetchBookingsCount(email);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);

            Alert.alert(
                "Error!",
                "An unexpected error occurred while fetching user data. Please try again later.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch bookings count from Firestore
    const fetchBookingsCount = async (email) => {
        try {
            // Create a query to count bookings for this user
            const bookingsQuery = query(
                collection(db, "bookings"),
                where("email", "==", email)
            );

            // Execute the query
            const querySnapshot = await getDocs(bookingsQuery);

            // Set the bookings count
            setBookingsCount(querySnapshot.size);
        } catch (error) {
            console.error("Error fetching bookings count:", error);
            // Default to 0 on error
            setBookingsCount(0);
        }
    };

    // load user data when the component mounts
    useEffect(() => {
        fetchUserData();
    }, []);

    // function to handle user logout
    const handleLogout = async () => {
        try {
            setLoading(true);

            // sign out the user from firebase authentication
            await signOut(auth);

            // remove user email from AsyncStorage
            await AsyncStorage.removeItem("userEmail");

            // clear the userEmail state
            setUserEmail(null);

            // show the message if user is logged out successfully
            Alert.alert(
                "Logout Successful!",
                "You have been logged out successfully.",
                [{ text: "OK" }]
            );

            // navigate to the login page after logout
            router.push("/signin");
        } catch (error) {
            console.log("Error while logging out:", error);

            // show an alert in case of an error during logout
            Alert.alert(
                "Logout Error!",
                "An unexpected error occurred while logging out. Please try again later.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    }

    // handle navigation to signup page
    const handleSignUp = () => {
        router.push("/signup");
    }

    // open image picker modal
    const handleEditProfileImage = () => {
        setImagePickerVisible(true);
    }

    // take a photo with device camera
    const takePhoto = async () => {
        setImagePickerVisible(false);

        // request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission needed", "Please grant camera permissions to take photos");
            return;
        }

        // launch camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    }

    // select photo from device gallery
    const selectFromGallery = async () => {
        setImagePickerVisible(false);

        // request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission needed", "Please grant media library permissions to select photos");
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    }

    // upload image to Firebase Storage
    const uploadImage = async (uri) => {
        try {
            setUploading(true);

            // convert image to blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // generate unique filename
            const filename = `profile_${auth.currentUser.uid}_${uuid()}.jpg`;
            const storageRef = ref(storage, `profileImages/${filename}`);

            // upload image to firebase storage
            await uploadBytes(storageRef, blob);

            // get download erl
            const downloadURL = await getDownloadURL(storageRef);

            // update user profile in firestore
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                profileImageUrl: downloadURL,
                updatedAt: new Date()
            });

            // update local state
            setProfileImage(downloadURL);

            Alert.alert("Success", "Profile image updated successfully");
        } catch (error) {
            console.log("Error uploading image:", error);
            Alert.alert("Upload Failed", "Failed to upload profile image. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    // show loading indicator
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f49b33" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* gradient background */}
            <LinearGradient
                colors={['#3a3a3a', '#2b2b2b', '#1a1a1a']}
                style={styles.background}
            />

            {/* image picker modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={imagePickerVisible}
                onRequestClose={() => setImagePickerVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Profile Photo</Text>

                        <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                            <Ionicons name="camera-outline" size={24} color="#f49b33" />
                            <Text style={styles.modalOptionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={selectFromGallery}>
                            <Ionicons name="image-outline" size={24} color="#f49b33" />
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        {profileImage && (
                            <TouchableOpacity
                                style={[styles.modalOption, { borderBottomWidth: 0 }]}
                                onPress={() => {
                                    setProfileImage(null);
                                    setImagePickerVisible(false);
                                }}
                            >
                                <Ionicons name="trash-outline" size={24} color="#ff4545" />
                                <Text style={[styles.modalOptionText, { color: '#ff4545' }]}>Remove Current Photo</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setImagePickerVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* main content */}
            {userEmail ? (
                <View style={styles.profileContainer}>
                    {/* profile image section with upload functionality */}
                    <View style={styles.avatarContainer}>
                        {uploading ? (
                            <View style={styles.uploadingContainer}>
                                <ActivityIndicator size="small" color="#f49b33" />
                            </View>
                        ) : (
                            <>
                                <Image
                                    source={
                                        profileImage
                                            ? { uri: profileImage }
                                            : require('../../assets/images/icon.png')
                                    }
                                    style={styles.avatar}
                                />
                                <TouchableOpacity
                                    style={styles.editIconContainer}
                                    onPress={handleEditProfileImage}
                                >
                                    <Ionicons name="pencil" size={16} color="#fff" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* welcome text and email display */}
                    <Text style={styles.welcomeText}>Welcome back!</Text>
                    <Text style={styles.emailText}>{userEmail}</Text>

                    {/* bio section - only show if user has a bio */}
                    {userData?.bio && (
                        <View style={styles.bioContainer}>
                            <View style={styles.bioHeader}>
                                <Ionicons name="document-text-outline" size={20} color="#f49b33" />
                                <Text style={styles.bioHeaderText}>About Me</Text>
                            </View>
                            <Text style={styles.bioText}>{userData.bio}</Text>
                        </View>
                    )}

                    {/* user stats section */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {bookingsCount}
                            </Text>
                            <Text style={styles.statLabel}>Bookings</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {userData?.favorites?.length || 0}
                            </Text>
                            <Text style={styles.statLabel}>Favorites</Text>
                        </View>
                    </View>

                    {/* settings menu */}
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/edit-profile')}
                        >
                            <Ionicons name="person-outline" size={24} color="#f49b33" />
                            <Text style={styles.menuText}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={20} color="#777" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="notifications-outline" size={24} color="#f49b33" />
                            <Text style={styles.menuText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={20} color="#777" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="settings-outline" size={24} color="#f49b33" />
                            <Text style={styles.menuText}>Settings</Text>
                            <Ionicons name="chevron-forward" size={20} color="#777" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/help')}
                        >
                            <Ionicons name="help-circle-outline" size={24} color="#f49b33" />
                            <Text style={styles.menuText}>Help & Support</Text>
                            <Ionicons name="chevron-forward" size={20} color="#777" />
                        </TouchableOpacity>
                    </View>

                    {/* logout button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // guest user view
                <View style={styles.guestContainer}>
                    {/* <Image
                        source={require('../../assets/images/icon.png')}
                        style={styles.guestImage}
                    /> */}
                    <Text style={styles.guestTitle}>Join DineTime Today</Text>
                    <Text style={styles.guestText}>
                        Create an account to book tables, save favorites, and get personalized recommendations.
                    </Text>

                    <TouchableOpacity
                        style={styles.signupButton}
                        onPress={handleSignUp}>
                        <Text style={styles.signupText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/signin")} className="flex flex-row justify-center items-center">
                        <Text className="text-white font-semibold">Already have an account? {" "}</Text>
                        <Text className="text-base font-semibold underline text-[#f49b33]">Sign In</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // main container styles
    container: {
        flex: 1,
        backgroundColor: '#2b2b2b',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
    },

    // profile section styles
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    // avatar and image upload styles
    avatarContainer: {
        marginTop: 30,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#f49b33',
    },
    uploadingContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#f49b33',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#f49b33',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },

    // welcome text styles
    welcomeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
    },
    emailText: {
        color: '#bbb',
        fontSize: 16,
        marginTop: 5,
    },

    // stats section styles
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        marginTop: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statNumber: {
        color: '#f49b33',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 5,
    },

    // bio section styles
    bioContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        marginTop: 20,
        padding: 15,
    },
    bioHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    bioHeaderText: {
        color: '#f49b33',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    bioText: {
        color: '#ddd',
        fontSize: 14,
        lineHeight: 20,
        fontStyle: 'italic',
    },

    // menu styles
    menuContainer: {
        marginTop: 25,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
        flex: 1,
    },

    // logout button styles
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#f49b33',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        width: '100%',
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // guest user section styles
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    guestImage: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    guestTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#f49b33',
        marginBottom: 15,
        textAlign: 'center',
    },
    guestText: {
        fontSize: 16,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    signupButton: {
        backgroundColor: '#f49b33',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
    },
    signupText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signinLink: {
        marginTop: 10,
    },
    signinText: {
        color: '#f49b33',
        fontSize: 14,
    },

    // Modal styles for image picker
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalOptionText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;