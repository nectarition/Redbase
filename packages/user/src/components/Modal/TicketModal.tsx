import { useCallback, useState } from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { TicketAppModel } from 'redbase'
import remarkGfm from 'remark-gfm'
import { convertStatus } from '../../helpers/statusHelper'
import useTicket from '../../hooks/useTicket'
import FormButton from '../Form/FormButton'
import FormInput from '../Form/FormInput'
import FormItem from '../Form/FormItem'
import FormSection from '../Form/FormSection'
import FormTextarea from '../Form/FormTextarea'

interface Props {
  ticket: TicketAppModel
  onUpdate: (ticket: TicketAppModel) => void
}
const TicketModal: React.FC<Props> = props => {
  const [isEdit, setIsEdit] = useState(false)
  const { updateTicketAsync } = useTicket()

  const [editableTicket, setEditableTicket] = useState<TicketAppModel>({
    ...props.ticket,
    description: props.ticket.description.replace(/\\n/g, '\n')
  })

  const handleUpdate = useCallback(() => {
    updateTicketAsync(editableTicket)
      .then(newTicket => {
        setEditableTicket({
          ...newTicket,
          description: newTicket.description.replace(/\\n/g, '\n')
        })
        props.onUpdate(newTicket)
        setIsEdit(false)
      })
      .catch(err => { throw err })
  }, [editableTicket])

  return (
    <Container>
      <Section>
        <SectionTitle>タイトル</SectionTitle>
        <h2>
          {isEdit
            ? (
              <FormInput
                onChange={e => setEditableTicket({ ...editableTicket, title: e.target.value })}
                value={editableTicket.title} />
            )
            : editableTicket.title}
        </h2>
      </Section>
      <Section>
        <SectionTitle>状態</SectionTitle>
        {convertStatus(editableTicket.status)}
      </Section>
      <Section>
        <SectionTitle>説明</SectionTitle>
        <Description>
          {isEdit
            ? (
              <FormTextarea
                onChange={e => setEditableTicket({ ...editableTicket, description: e.target.value })}
                value={editableTicket.description} />
            )
            : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {editableTicket.description.replace(/\\n/g, '\n')}
              </ReactMarkdown>
            )}
        </Description>
      </Section>
      <Section>
        <SectionTitle>リビジョン</SectionTitle>
        {editableTicket.revision}
      </Section>
      {!isEdit
        ? (
          <FormSection>
            <FormButton onClick={() => setIsEdit(!isEdit)}>編集</FormButton>
          </FormSection>
        )
        : (
          <FormSection>
            <FormItem>
              <FormButton onClick={handleUpdate}>更新</FormButton>
              <FormButton onClick={() => setIsEdit(!isEdit)}>キャンセル</FormButton>
            </FormItem>
          </FormSection>
        )}
    </Container>
  )
}

export default TicketModal

const Container = styled.div`
  padding: 10px;
`
const SectionTitle = styled.div`
  margin-bottom: 2px;
  font-size: 0.9em;
  color: #808080;
`
const Section = styled.div`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Description = styled.div`
  h1, h2, h3, h4, h5, h6, p, ul, ol {
    margin-bottom: 5px;
  }
`
