import { useCallback, useEffect, useState } from 'react'
import {
  type Auth,
  type User,
  type UserCredential,
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged
} from 'firebase/auth'
import {
  type Firestore,
  getFirestore as getFirebaseFirestore
} from 'firebase/firestore'
import { getFirebaseApp } from '../libs/FirebaseApp'

interface IUseFirebase {
  isLoggedIn: boolean | undefined
  user: User | null | undefined
  getAuth: () => Auth
  loginByEmailAsync: (email: string, password: string) => Promise<UserCredential>
  logoutAsync: () => Promise<void>
  getFirestore: () => Firestore
}

const useFirebase = (): IUseFirebase => {
  const [auth, setAuth] = useState<Auth | undefined>()
  const [isLoggedIn, setLoggedIn] = useState<boolean | undefined>()
  const [user, setUser] = useState<User | null | undefined>()

  const getAuth =
    useCallback(() => {
      if (auth) {
        return auth
      }

      const app = getFirebaseApp()
      const _auth = getFirebaseAuth(app)
      setAuth(_auth)

      return _auth
    }, [])

  const loginByEmailAsync =
    useCallback(async (email: string, password: string) => {
      const auth = getAuth()
      const credential = await signInWithEmailAndPassword(auth, email, password)
        .catch(err => { throw err })
      return credential
    }, [])

  const logoutAsync =
    useCallback(async () => {
      const auth = getAuth()
      await signOut(auth)
        .then(() => {
          setUser(null)
          setLoggedIn(false)
        })
        .catch(err => { throw err })
    }, [])

  const getFirestore = getFirebaseFirestore

  useEffect(() => {
    const auth = getAuth()
    const unSubscribe = onIdTokenChanged(auth, user => {
      setUser(user)
      setLoggedIn(!!user)

      if (!user) {
        return unSubscribe
      }
    })
    return unSubscribe
  }, [])

  return {
    isLoggedIn,
    user,
    getAuth,
    loginByEmailAsync,
    logoutAsync,
    getFirestore
  }
}

export default useFirebase
