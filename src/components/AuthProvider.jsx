import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext  =createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      try {
        setCurrentUser(user)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
  })
  }, [])
  
  const value={currentUser}//destructure currentUser and pass in to value
  
  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading&& children}
    </AuthContext.Provider>
    </>
      )
}
