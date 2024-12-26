import type { DocumentReference } from 'firebase/firestore'

export interface Ticket {
  title: string;
  description: string;
  status: TicketStatus;
}
export type TicketDocument = Ticket & {
  id: string
  tag: string
}
export type TicketAppModel = TicketDocument
export type TicketDbModel = TicketDocument

export type TicketStatus = 'new' | 'in-progress' | 'closed'

export interface TicketTag {
  ticket: DocumentReference<Ticket>
}
export type TicketTagDocument = TicketTag & {
  id: string
}
export type TicketTagAppModel = TicketTagDocument
export type TicketTagDbModel = TicketTagDocument

export interface User {
  name: string
}
export type UserDocument = User & {
  id: string
}
export type UserAppModel = UserDocument
export type UserDbModel = UserDocument
