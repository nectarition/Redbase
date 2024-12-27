import { useContext } from 'react'
import styled from 'styled-components'
import TicketCreateModal from '../components/Modal/TicketCreateModal'
import TicketModal from '../components/Modal/TicketModal'
import { ModalContext, ModalProps } from '../providers/ModalProvider'
import type { TicketAppModel } from 'redbase'

interface IUseModal {
  showModalAsync: (props: ModalProps) => Promise<void>
  showTicketModalAsync: (ticket: TicketAppModel, onUpdate: (newTicket: TicketAppModel) => void) => Promise<void>
  showCreateTicketModalAsync: (projectId: string) => Promise<TicketAppModel>
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
      isShowCloseButton: true
    })
  }

  const showCreateTicketModalAsync = async (projectId: string) => {
    return new Promise<TicketAppModel>((resolve, reject) => {
      showModalAsync({
        title: 'チケット作成',
        children: (
          <TicketCreateModal
            projectId={projectId}
            reject={reject}
            resolve={resolve} />
        ),
        type: 'dialog',
        isUsedCloseByKeyboard: false,
        isUsedCloseByClickOutside: false,
        isShowCloseButton: true
      })
    })
  }

  return {
    showModalAsync,
    showTicketModalAsync,
    showCreateTicketModalAsync
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
