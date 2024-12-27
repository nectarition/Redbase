import { useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import useFirebase from './useFirebase'

interface IUseProject {
  getMyProjectIdsAsync: () => Promise<string[]>
}

export const useProject = (): IUseProject => {
  const { user, getFirestore } = useFirebase()
  const db = getFirestore()

  const getMyProjectIdsAsync = useCallback(async () => {
    if (!user) {
      throw new Error('User is not signed in')
    }
    const myProjectsRef = collection(db, 'users', user.uid, 'projects')
    const projects = await getDocs(myProjectsRef)
    return projects.docs.map(doc => doc.id)
  }, [user])

  return {
    getMyProjectIdsAsync
  }
}

export default useProject
