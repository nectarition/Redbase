import { TicketStatusType } from 'redbase'

export const ticketStatusTypes: Record<TicketStatusType, string> = {
  'new': '新規',
  'in-progress': '進行中',
  'completed': '完了',
  'omitted': 'オミット'
}
