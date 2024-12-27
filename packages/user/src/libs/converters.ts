import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore'
import { NextTicketTag, ProjectDbModel, TicketDbModel, TicketTagDbModel } from 'redbase'

export const projectConverter: FirestoreDataConverter<ProjectDbModel> = {
  toFirestore: () => ({}),
  fromFirestore: (snapshot: QueryDocumentSnapshot): ProjectDbModel => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      organization: data.organization
    }
  }
}

export const ticketConverter: FirestoreDataConverter<TicketDbModel> = {
  toFirestore: (ticket: TicketDbModel) => ({
    tag: ticket.tag,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    project: ticket.project,
    revision: ticket.revision,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
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
      revision: data.revision,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
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

export const nextTicketTagConverter: FirestoreDataConverter<NextTicketTag> = {
  toFirestore: (nextTicketTag: NextTicketTag) => ({
    nextTag: nextTicketTag.nextTag
  }),
  fromFirestore: (snapshot: QueryDocumentSnapshot): NextTicketTag => {
    const data = snapshot.data()
    return {
      nextTag: data.nextTag
    }
  }
}
