'use client'

import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, {createContext, useContext, useEffect, useState} from 'react'

const AuthContext = createContext();


export function useAuth(){
    return useContext(AuthContext);
}
export default function AuthProvider(props) {
    const  {children} = props;
    const  [currentUser, setCurrentUser] = useState(null);
    const  [isLoadingUser, setIsLoadingUser] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password ){

        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        setCurrentUser(null);
        return signOut(auth);
    }

    //resetPasswordEmail

    //sendPasswordResetEmail( auth, email)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user)=>{
            console.log("authenticating user...");
            setIsLoadingUser(true);
            try {
                //if user exists fetch data
                setCurrentUser(user);

                if(!user){
                    throw Error('No user found');
                }

                

            }
            catch(err){
                console.log(err.message);
            }
            finally {
                setIsLoadingUser(false);
            }

        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isLoadingUser,
        signup,
        login,
        logout
    }

 
    
    return (
    
       <AuthContext.Provider value={value}>
            {children}
       </AuthContext.Provider>
    
  )
}
