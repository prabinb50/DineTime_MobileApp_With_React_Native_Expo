import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../assets/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.PRIMARY, tabBarInactiveTintColor: Colors.dark.text, tabBarStyle: { backgroundColor: Colors.SECONDARY, height: 75 },
                tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" }
            }}>
            <Tabs.Screen name='home' options={{
                title: "Home", tabBarIcon: ({ color }) => (
                    <Ionicons name="home" size={24} color={color} />)
            }} />

            <Tabs.Screen name='history' options={{
                title: "History", tabBarIcon: ({ color }) => (
                    <Ionicons name="time" size={24} color={color} />)
            }} />

            <Tabs.Screen name='profile' options={{
                title: "Profile", tabBarIcon: ({ color }) => (
                    <Ionicons name="person-sharp" size={24} color={color} />)
            }} />
        </Tabs>
    )
}

export default TabLayout