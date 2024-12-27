import { TicketStatusType } from 'redbase'

const convertStatus = (status: TicketStatusType): string => {
  switch (status) {
    case 'new':
      return '新規'
    case 'in-progress':
      return '進行中'
    case 'closed':
      return '完了'
  }
}

export {
  convertStatus
}
