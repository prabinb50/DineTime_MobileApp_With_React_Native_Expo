import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const Restaurant = () => {

    const {restaurant} = useLocalSearchParams(); 

    return (
        <SafeAreaView>
            <Text>{restaurant}</Text>
        </SafeAreaView>
    )
}

export default Restaurant;