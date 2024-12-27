import { useContext } from 'react'
import styled from 'styled-components'
import TicketModal from '../components/Modal/TicketModal'
import { ModalContext, ModalProps } from '../providers/ModalProvider'
import type { TicketAppModel } from 'redbase'

interface IUseModal {
  showModalAsync: (props: ModalProps) => Promise<void>
  showTicketModalAsync: (ticket: TicketAppModel, onUpdate: (newTicket: TicketAppModel) => void) => Promise<void>
}

const useModal = (): IUseModal => {
  const showModalAsync = useContext(ModalContext)

  const showTicketModalAsync = async (ticket: TicketAppModel, onUpdate: (newTicket: TicketAppModel) => void) => {
    await showModalAsync({
      title: (
        <Title>
          <TitleTag>#{ticket.tag}</TitleTag>
          <TitleName>チケット詳細</TitleName>
        </Title>
      ),
      children: (
        <TicketModal
          onUpdate={onUpdate}
          ticket={ticket} />
      ),
      type: 'dialog',
      isUsedCloseByKeyboard: false,
      isUsedCloseByClickOutside: false,
      cancelActionAsync: async () => {
        if (!confirm('ダイアログを閉じますか？')) {
          throw new Error('Canceled')
        }
      }
    })
  }

  return {
    showModalAsync,
    showTicketModalAsync
  }
}

export default useModal

const Title = styled.div`
  display: flex;
  gap: 5px;
`
const TitleTag = styled.span`
  display: inline-block;
  background-color: #f0f0f0;
  color: #333;
  padding: 0 4px;
  font-weight: normal;
`
const TitleName = styled.span``
