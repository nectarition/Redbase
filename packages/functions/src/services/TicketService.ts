import FirebaseAdmin from '../libs/FirebaseAdmin'

const admin = FirebaseAdmin.getFirebaseAdmin()
const db = admin.firestore()

const addTicketTagAsync = async (ticketId: string, tagId: string) => {
  const ticketRef = db.collection('tickets').doc(ticketId)
  const ticketTagRef = db.collection('ticketTags').doc(tagId)
  await ticketTagRef.set({
    ticket: ticketRef
  })
}

const removeTicketTagAsync = async (tagId: string) => {
  const ticketTagRef = db.collection('ticketTags').doc(tagId)
  await ticketTagRef.delete()
}

export default {
  addTicketTagAsync,
  removeTicketTagAsync
}
