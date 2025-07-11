'use client'

import { 
    useContext, 
    useEffect, 
    useState,
    createContext,
    ReactNode 
} from 'react'
import { 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth'

import { auth, db } from '../firebase'
import {doc} from 'firebase/firestore'

interface AuthContextType {
    currentUser: User | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children } : { children: ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true)

    const login = (email: string, password: string) => {
       signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
    }

    const signup = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });
    }

    const logout = () => {
        setUserData({})
        setCurrentUser(null);
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user : any) => { // Keepsthe app in sync with Firebase Auth
            try {
                setCurrentUser(user); // Sets the user after Firebase verifies
                setLoading(false) // Stops the loading

                if(!user) {
                    return
                } 

                const docRef = doc(db, 'users', user.uid)
            
            } catch (error) {
                console
            }
        });

        return unsubscribe // Then clean listener component unmount
    }, [])

    if (loading) return null // adding a spinner

    return (
        <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}