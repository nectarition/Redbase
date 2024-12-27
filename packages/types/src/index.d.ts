import type { DocumentReference, FieldValue } from 'firebase/firestore'

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
}
type ProjectDocument = Project & {
  id: string
}
export type ProjectAppModel = ProjectDocument & {
  organizationId: string
}
export type ProjectDbModel = ProjectDocument & {
  organization: DocumentReference<OrganizationDbModel>
}

export interface Ticket {
  title: string;
  description: string;
  status: TicketStatusType;
  revision: number;
}
type TicketDocument = Ticket & {
  id: string
  tag: string
}
export type TicketAppModel = TicketDocument & {
  createdAt: Date
  updatedAt: Date
  projectId: string
}
export type TicketDbModel = TicketDocument & {
  createdAt: FieldValue
  updatedAt: FieldValue
  project: DocumentReference<ProjectDbModel>
}

export type TicketStatusType = 'new' | 'in-progress' | 'completed' | 'omitted'

type TicketTagDocument = {
  id: string
}
export type TicketTagAppModel = TicketTagDocument & {
  ticketId: string
}
export type TicketTagDbModel = TicketTagDocument & {
  ticket: DocumentReference<TicketDbModel>
}

export interface NextTicketTag {
  nextTag: number
}

export interface User {
  name: string
}
type UserDocument = User & {
  id: string
}
export type UserAppModel = UserDocument
export type UserDbModel = UserDocument
