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
    signInWithPopup, 
    signOut 
} from 'firebase/auth'

import { auth, db } from '../firebase'
import { doc, getDoc, setDoc} from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'
import Loading from '@/app/components/Loading'

interface UserData {
    email: string;
    displayName?: string;
    createdAt?: Date;
}

interface AuthContextType {
    currentUser: User | null,
    userData: UserData | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>,
    signinWithGoogle: () => Promise<void>,
    logout: () => Promise<void>,
    loading: boolean,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export const AuthProvider = ({ children } : { children: ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    const login = async (email: string, password: string) => {
        try{
            await signInWithEmailAndPassword(auth, email, password)
        } catch(error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const signup = async (email: string, password: string) => {
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date()
            })
        } catch(error) {
            console.error("Signup error:", error);
            throw error;
        }
    }

    const signinWithGoogle = async() => {
        try{
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    email: user.email,
                    createdAt: new Date(),
                    displayName: user.displayName || ''
                })
            }
        } catch(error) {
            console.log("Google SignIn error: ", error)
            throw error
        }
    }

    const logout = async () => {
        try{
            setUserData(null)
            setCurrentUser(null);
            return signOut(auth)
        } catch (error) {
            console.error("Logout error:", error)
            throw error
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user : User | null) => { // Keepsthe app in sync with Firebase Auth
            const fetchUserData = async () => {
                try {
                    setCurrentUser(user); // Sets the user after Firebase verifies
                    setLoading(false) // Stops the loading

                    if(!user) {
                        console.log("No user found...")
                        return
                    }

                    // if the user exists, it will fetch data from firebase db
                    const docRef = doc(db, 'users', user.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        const firebaseData = docSnap.data() as UserData
                        setUserData(firebaseData)
                        console.log("User Data set",firebaseData)
                    }
                
                } catch (error) {
                    console.error("Fetch user error:", error)
                }
            }

            fetchUserData()
        });

        return unsubscribe // Then clean listener component unmount
    }, [])


    // testing userData and currentUser
    useEffect(() => {
        console.log("Auth ")
        console.log(currentUser)
        console.log(userData)
    })

    const value = {
        currentUser,
        userData,
        login,
        signup,
        signinWithGoogle,
        logout,
        loading
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}