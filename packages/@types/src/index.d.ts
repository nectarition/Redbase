import type { DocumentReference } from 'firebase/firestore'

export interface Organization {
  name: string;
}
type OrganizationDocument = Organization & {
  id: string
}
export type OrganizationAppModel = OrganizationDocument
export type OrganizationDbModel = OrganizationDocument

export interface Project {
  name: string;
  organization: DocumentReference<Organization>;
}
type ProjectDocument = Project & {
  id: string
}
export type ProjectAppModel = ProjectDocument
export type ProjectDbModel = ProjectDocument

export interface Ticket {
  project: DocumentReference<Project>;
  title: string;
  description: string;
  status: TicketStatusType;
  revision: number;
}
type TicketDocument = Ticket & {
  id: string
  tag: string
}
export type TicketAppModel = TicketDocument
export type TicketDbModel = TicketDocument

export type TicketStatusType = 'new' | 'in-progress' | 'closed'

export interface TicketTag {
  ticket: DocumentReference<Ticket>
}
type TicketTagDocument = TicketTag & {
  id: string
}
export type TicketTagAppModel = TicketTagDocument
export type TicketTagDbModel = TicketTagDocument

export interface User {
  name: string
}
type UserDocument = User & {
  id: string
}
export type UserAppModel = UserDocument
export type UserDbModel = UserDocument
