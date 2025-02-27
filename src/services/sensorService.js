import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '../firebase';

export const subscribeToDHT11Data = (callback) => {
    const tempRef = ref(rtdb, '/sensor/temperature');
    const humRef = ref(rtdb, '/sensor/humidity');
    
    // Listen for temperature updates
    const tempUnsubscribe = onValue(tempRef, (snapshot) => {
        const temperature = snapshot.val();
        if (temperature !== null) {
            callback({ type: 'temperature', value: temperature });
        }
    }, (error) => {
        console.error("Temperature data fetch error:", error);
        callback({ type: 'temperature', error: true });
    });

    // Listen for humidity updates
    const humUnsubscribe = onValue(humRef, (snapshot) => {
        const humidity = snapshot.val();
        if (humidity !== null) {
            callback({ type: 'humidity', value: humidity });
        }
    }, (error) => {
        console.error("Humidity data fetch error:", error);
        callback({ type: 'humidity', error: true });
    });

    // Return unsubscribe function
    return () => {
        tempUnsubscribe();
        humUnsubscribe();
    };
}; 