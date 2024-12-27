import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { TicketAppModel } from 'packages/types/src'
import { TicketCreatePayload } from '../../@types'
import useTicket from '../../hooks/useTicket'
import FormButton from '../Form/FormButton'
import FormInput from '../Form/FormInput'
import FormItem from '../Form/FormItem'
import FormLabel from '../Form/FormLabel'
import FormSection from '../Form/FormSection'
import FormTextarea from '../Form/FormTextarea'

interface Props {
  projectId: string
  resolve: (newTicket: TicketAppModel) => void
  reject: (reason: unknown) => void
}
const TicketCreateModal: React.FC<Props> = props => {
  const { createTicketAsync } = useTicket()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateTicket = useCallback(() => {
    if (!props.projectId || !title) return
    const ticket: TicketCreatePayload = {
      projectId: props.projectId,
      title,
      description: description.trim() || 'This is a new ticket.'
    }
    createTicketAsync(ticket)
      .then(props.resolve)
      .catch(props.reject)
  }, [props.projectId, title, description])

  return (
    <Container>
      <FormSection>
        <FormItem>
          <FormLabel>プロジェクトID</FormLabel>
          <FormInput
            disabled
            value={props.projectId} />
        </FormItem>
        <FormItem>
          <FormLabel>タイトル</FormLabel>
          <FormInput
            onChange={e => setTitle(e.target.value)}
            value={title} />
        </FormItem>
        <FormItem>
          <FormLabel>説明</FormLabel>
          <FormTextarea
            onChange={e => setDescription(e.target.value)}
            value={description} />
        </FormItem>
      </FormSection>
      <FormSection>
        <FormItem $inlined>
          <FormButton onClick={handleCreateTicket}>
            作成
          </FormButton>
        </FormItem>
      </FormSection>
    </Container>
  )
}

export default TicketCreateModal

const Container = styled.div`
  padding: 10px;
`
