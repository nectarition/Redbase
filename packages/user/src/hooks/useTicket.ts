import { useCallback } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { TicketAppModel, TicketTagAppModel } from 'redbase'
import { ticketConverter, ticketTagConverter } from '../libs/converters'
import useFirebase from './useFirebase'

interface IUseTicket {
  getTicketAsync: (ticketId: string) => Promise<TicketAppModel>
  getTicketTagAsync: (ticketTagId: string) => Promise<TicketTagAppModel>
}

export const useTicket = (): IUseTicket => {
  const { getFirestore } = useFirebase()
  const db = getFirestore()

  const getTicketAsync =
    useCallback(async (ticketId: string) => {
      const ticketRef = doc(db, 'tickets', ticketId)
        .withConverter(ticketConverter)
      const ticketDoc = await getDoc(ticketRef)
      const ticket = ticketDoc.data()
      if (!ticket) {
        throw new Error(`Ticket not found: ${ticketId}`)
      }
      return ticket
    }, [])

  const getTicketTagAsync =
    useCallback(async (ticketTagId: string) => {
      const ticketTagRef = doc(db, 'ticketTags', ticketTagId)
        .withConverter(ticketTagConverter)
      const ticketTagDoc = await getDoc(ticketTagRef)
      const ticketTag = ticketTagDoc.data()
      if (!ticketTag) {
        throw new Error(`TicketTag not found: ${ticketTagId}`)
      }
      return ticketTag
    }, [])

  return {
    getTicketAsync,
    getTicketTagAsync
  }
}

export default useTicket
