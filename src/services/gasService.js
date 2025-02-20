import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
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

export const deleteCylinder = async (userId, cylinderId) => {
    const userRef = doc(db, 'users', userId);
    try {
        const snapshot = await getDoc(userRef);
        const userData = snapshot.data();
        const updatedCylinders = userData.gasCylinders.filter(
            cylinder => cylinder.id !== cylinderId
        );
        
        await updateDoc(userRef, {
            gasCylinders: updatedCylinders
        });
        return true;
    } catch (error) {
        console.error('Error deleting cylinder:', error);
        return false;
    }
}; 