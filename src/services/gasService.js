import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

export const subscribeToGasUpdates = (userId, callback) => {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        }
    });
};

export const updateGasWeight = async (userId, cylinderId, newWeight) => {
    const userRef = doc(db, 'users', userId);
    
    try {
        await updateDoc(userRef, {
            gasCylinders: arrayUnion({
                id: cylinderId,
                currentWeight: newWeight,
                lastUpdated: new Date().toISOString()
            })
        });
        return true;
    } catch (error) {
        console.error('Error updating gas weight:', error);
        return false;
    }
}; 