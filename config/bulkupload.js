import { collection, doc, setDoc } from "firebase/firestore";
import { slots } from "../store/restaurants";
import { db } from "./firebaseConfig";

const restaurantData = slots;

const uploadData = async () => {
    try {
        for (let i = 0; i < restaurantData.length; i++) {
            const restaurant = restaurantData[i];

            const docRef = doc(collection(db, "slots"), `slots_${i + 1}`);

            await setDoc(docRef, restaurant);
        }
        console.log("Data uploaded successfully!");
    } catch (error) {
        console.error("Error uploading data: ", error);
    }
}

export default uploadData;