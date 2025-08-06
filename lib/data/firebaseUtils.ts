import { db } from "../../firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

export const saveMoodToFirestore = async ({
    userId,
    group,
    emoji,
    day,
    month,
    year
}: {
    userId: string;
    group: string;
    emoji: string;
    day: number;
    month: number;
    year: number;
}) => {
    try {
        const docRef = await addDoc(collection(db, "moods"), {
            userId,
            group,
            emoji,
            day,
            month,
            year,
            createdAt: Timestamp.now(),
        });
        console.log("Mood saved with ID:", docRef.id)
    } catch (error) {
        console.error("Error saving mood:", error);
        throw error;
    }
}