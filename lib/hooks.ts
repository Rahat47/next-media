import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // turn of realtime subcription
        let unsubscribe = null;

        if (user) {
            const ref = firestore.collection('users').doc(user.uid);
            unsubscribe = ref.onSnapshot(snapshot => {
                const userData = snapshot.data();
                setUsername(userData?.username);
            });
        } else {
            setUsername(null);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return { user, username };
}
