import { useCallback } from 'react'
import { collection, doc, getDoc, getDocs, query, runTransaction, where } from 'firebase/firestore'
import { TicketAppModel, TicketDbModel, TicketTagAppModel } from 'redbase'
import { ticketConverter, ticketTagConverter } from '../libs/converters'
import useFirebase from './useFirebase'

interface IUseTicket {
  getTicketAsync: (ticketId: string) => Promise<TicketAppModel>
  getTicketTagAsync: (ticketTagId: string) => Promise<TicketTagAppModel>
  getTicketsByProjectIdAsync: (projectId: string) => Promise<TicketAppModel[]>
  updateTicketAsync: (ticket: TicketAppModel) => Promise<TicketAppModel>
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

  const getTicketsByProjectIdAsync =
    useCallback(async (projectId: string) => {
      const ticketsRef = collection(db, 'tickets')
        .withConverter(ticketConverter)
      const projectRef = doc(db, 'projects', projectId)
      const ticketQuery = query(ticketsRef, where('project', '==', projectRef))
      const ticketSnapshot = await getDocs(ticketQuery)
      const tickets = ticketSnapshot.docs.map(doc => doc.data())
      return tickets
    }, [])

  const updateTicketAsync =
    useCallback(async (newTicket: TicketAppModel) => {
      const ticketRef = doc(db, 'tickets', newTicket.id)
        .withConverter(ticketConverter)

      const newRevisionTicket: TicketDbModel = {
        ...newTicket,
        revision: newTicket.revision + 1
      }

      await runTransaction(db, async tx => {
        const ticketDoc = await tx.get(ticketRef)
        const ticket = ticketDoc.data()
        if (!ticket) {
          throw new Error(`Ticket not found: ${newRevisionTicket.id}`)
        }
        else if (ticket.revision >= newRevisionTicket.revision) {
          throw new Error(`Ticket is outdated: excepted revision ${newRevisionTicket.revision}, but got ${ticket.revision}`)
        }

        tx.set(ticketRef, newRevisionTicket)
      })

      return newRevisionTicket
    }, [])

  return {
    getTicketAsync,
    getTicketTagAsync,
    getTicketsByProjectIdAsync,
    updateTicketAsync
  }
}

export default useTicket
