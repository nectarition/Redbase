import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore'
import { TicketDbModel, TicketTagDbModel } from 'redbase'

export const ticketConverter: FirestoreDataConverter<TicketDbModel> = {
  toFirestore: (ticket: TicketDbModel) => ({
    tag: ticket.tag,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    project: ticket.project,
    revision: ticket.revision
  }),
  fromFirestore: (snapshot: QueryDocumentSnapshot): TicketDbModel => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      tag: data.tag,
      title: data.title,
      description: data.description,
      status: data.status,
      project: data.project,
      revision: data.revision
    }
  }
}

export const ticketTagConverter: FirestoreDataConverter<TicketTagDbModel> = {
  toFirestore: () => ({}),
  fromFirestore: (snapshot: QueryDocumentSnapshot): TicketTagDbModel => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ticket: data.ticket
    }
  }
}
