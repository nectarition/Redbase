import { useCallback } from 'react'
import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, Timestamp, where } from 'firebase/firestore'
import { TicketAppModel, TicketDbModel, TicketTagAppModel } from 'redbase'
import { TicketCreatePayload } from '../@types'
import { nextTicketTagConverter, projectConverter, ticketConverter, ticketTagConverter } from '../libs/converters'
import useFirebase from './useFirebase'

interface IUseTicket {
  getTicketAsync: (ticketId: string) => Promise<TicketAppModel>
  getTicketTagAsync: (ticketTagId: string) => Promise<TicketTagAppModel>
  getTicketsByProjectIdAsync: (projectId: string) => Promise<TicketAppModel[]>
  createTicketAsync: (payload: TicketCreatePayload) => Promise<TicketAppModel>
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
      return {
        ...ticket,
        projectId: ticket.project.id,
        createdAt: (ticket.createdAt as Timestamp).toDate(),
        updatedAt: (ticket.updatedAt as Timestamp).toDate()
      }
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
      return {
        ...ticketTag,
        ticketId: ticketTag.ticket.id
      }
    }, [])

  const getTicketsByProjectIdAsync =
    useCallback(async (projectId: string) => {
      const ticketsRef = collection(db, 'tickets')
        .withConverter(ticketConverter)
      const projectRef = doc(db, 'projects', projectId)
      const ticketQuery = query(ticketsRef, where('project', '==', projectRef))
      const ticketSnapshot = await getDocs(ticketQuery)
      const tickets = ticketSnapshot.docs
        .map(doc => {
          const ticket = doc.data()
          return {
            ...ticket,
            projectId: ticket.project.id,
            createdAt: (ticket.createdAt as Timestamp).toDate(),
            updatedAt: (ticket.updatedAt as Timestamp).toDate()
          }
        })
      return tickets
    }, [])

  const createTicketAsync =
    useCallback(async (payload: TicketCreatePayload) => {
      const ticketRef = doc(collection(db, 'tickets'))
        .withConverter(ticketConverter)
      const projectRef = doc(db, 'projects', payload.projectId)
        .withConverter(projectConverter)
      const nextTicketTagRef = doc(db, 'params', 'ticketTag')
        .withConverter(nextTicketTagConverter)

      await runTransaction(db, async tx => {
        const nextTicketTagDoc = await tx.get(nextTicketTagRef)
        const nextTicketTag = nextTicketTagDoc.data()
        if (!nextTicketTag) {
          throw new Error('NextTicketTag not found')
        }

        const nextTag = nextTicketTag.nextTag.toString()
        tx.update(nextTicketTagRef, { nextTag: nextTicketTag.nextTag + 1 })

        const newTicket: TicketDbModel = {
          project: projectRef,
          title: payload.title,
          description: payload.description,
          status: 'new',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          revision: 1,
          id: '',
          tag: nextTag
        }
        tx.set(ticketRef, newTicket)
      })

      const ticketDoc = await getDoc(ticketRef)
      const ticket = ticketDoc.data()
      if (!ticket) {
        throw new Error('Failed to create ticket')
      }

      return {
        ...ticket,
        projectId: ticket.project.id,
        createdAt: (ticket.createdAt as Timestamp).toDate(),
        updatedAt: (ticket.updatedAt as Timestamp).toDate()
      }
    }, [])

  const updateTicketAsync =
    useCallback(async (newTicket: TicketAppModel) => {
      const ticketRef = doc(db, 'tickets', newTicket.id)
        .withConverter(ticketConverter)
      const projectRef = doc(db, 'projects', newTicket.projectId)
        .withConverter(projectConverter)

      const newRevisionTicket: TicketDbModel = {
        title: newTicket.title,
        description: newTicket.description,
        status: newTicket.status,
        project: projectRef,
        revision: newTicket.revision + 1,
        createdAt: Timestamp.fromDate(newTicket.createdAt),
        updatedAt: serverTimestamp(),
        id: newTicket.id,
        tag: newTicket.tag
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

      const updatedTicketDoc = await getDoc(ticketRef)
      const updatedTicket = updatedTicketDoc.data()
      if (!updatedTicket) {
        throw new Error(`Failed to update ticket: ${newTicket.id}`)
      }

      return {
        ...updatedTicket,
        projectId: updatedTicket.project.id,
        createdAt: (updatedTicket.createdAt as Timestamp).toDate(),
        updatedAt: (updatedTicket.updatedAt as Timestamp).toDate()
      }
    }, [])

  return {
    getTicketAsync,
    getTicketTagAsync,
    getTicketsByProjectIdAsync,
    createTicketAsync,
    updateTicketAsync
  }
}

export default useTicket
