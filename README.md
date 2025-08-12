# DineTime - Restaurant Booking App

## Overview
**DineTime** is a mobile application built with **React Native**, **Expo**, **NativeWind**, and **Firebase** that allows users to discover restaurants and make table reservations. The app provides a seamless experience for restaurant bookings, personalized user profiles, and restaurant exploration.

---

## Features

### **User Authentication**
- **Sign Up** with email and password using Firebase Authentication.
- Store user profile (`email`, `createdAt`) in Firestore.
- **Sign In** with email and password using Firebase Authentication.
- Fetch and verify user document from Firestore after login.
- Save `userEmail` and `isGuest` flag in AsyncStorage for session persistence.
- **Guest Login** option without account creation, allowing bookings using name and phone number but without access to booking history and profile page.
- Form handling and validation with Formik and a shared validation schema.
- Error handling for invalid credentials, email already in use, and unexpected errors.

---

### **Restaurant Experience**
- **Restaurant Discovery:** Browse through a curated list of restaurants.
- **Restaurant Details:** View comprehensive information about each restaurant.
- **Table Booking:** Make reservations by selecting date, time, and number of guests.
- **Booking History:** Track all your past and upcoming reservations.

---

### **User Profile**
- **Profile Customization:** Upload profile images and edit personal information like bio.
- **Booking Statistics:** View your booking history and related statistics.
- **Change Password:** Update account password securely via Firebase Authentication.

---

## Technology Stack
- **Frontend:** React Native, Expo
- **Styling:** NativeWind
- **Navigation:** Expo Router (file-based routing)
- **Authentication & Database:** Firebase (Authentication, Firestore, Storage)
- **Forms Management:** Formik with validation schemas
- **Local Storage:** AsyncStorage for persisting user sessions

---

## Installation

1. **Clone the repository**

   git clone https://github.com/yourusername/dinetime.git
   cd dinetime
   
2. **Install dependencies**

    npm i

3. **Set up Firebase**

    Create a Firebase project at Firebase Console
    Enable Authentication, Firestore, and Storage services
    Add your Firebase configuration in config/firebaseConfig.js

4. **Start the development server**

    npx expo start
    # or
    npm start

---

## Running the App

    iOS Simulator: Press i in the terminal or click on "Run on iOS simulator"
    Android Emulator: Press a in the terminal or click on "Run on Android emulator"
    Physical Device: Scan the QR code with the Expo Go app (available on `iOS` and `Android`)

---

## Building for Production

1. **For Expo Go**

    npx expo publish

2. **For Native Builds**

    *For Android*

    npx expo build:android

    *For iOS*

    npx expo build:ios

---

## Development Workflow

1. **Environment Setup**

    Ensure you have Node.js and npm installed
    Install Expo CLI: npm install -g expo-cli

2. **Code Formatting and Linting**

    This project uses ESLint for code quality
    Run npm run lint to check for code issues

3. **Testing**

    Run npm test to execute tests

---

## Contributing

    Fork the repository
    Create your feature branch: git checkout -b feature/amazing-feature
    Commit your changes: git commit -m 'Add some amazing feature'
    Push to the branch: git push origin feature/amazing-feature
    Open a Pull Request


