import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import TicketService from '../services/TicketService'

export const onWriteTicket = onDocumentWritten('tickets/{ticketId}', event => {
  const change = event.data
  if (!change) {
    throw new Error('Change is undefined')
  }

  const ticketId = event.params.ticketId

  const before = change.before.data()
  const after = change.after.data()

  if (!before && after) {
    console.log(`Adding ticket tag: ${ticketId} ${after.tag}`)
    TicketService.addTicketTagAsync(ticketId, after.tag)
  }
  else if (before && !after) {
    console.log(`Removing ticket tag: ${ticketId} ${before.tag}`)
    TicketService.removeTicketTagAsync(before.tag)
  }
})
