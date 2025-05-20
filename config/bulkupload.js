import { collection, doc, setDoc } from "firebase/firestore";
import { restaurants } from "../store/restaurants";
import { db } from "./firebaseConfig";

const restaurantData = restaurants;

const uploadData = async () => {
    try {
        for (let i = 0; i < restaurantData.length; i++) {
            const restaurant = restaurantData[i];

            const docRef = doc(collection(db, "restaurants"), `restaurant_${i + 1}`);

            await setDoc(docRef, restaurant);
        }
        console.log("Data uploaded successfully!");
    } catch (error) {
        console.error("Error uploading data: ", error);
    }
}

export default uploadData;