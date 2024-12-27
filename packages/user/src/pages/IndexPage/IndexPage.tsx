import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import { ticketStatusTypes } from '../../helpers/statusHelper'
import useFirebase from '../../hooks/useFirebase'
import useModal from '../../hooks/useModal'
import useTicket from '../../hooks/useTicket'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { TicketCreatePayload } from '../../@types'
import type { TicketAppModel, TicketTagAppModel } from 'redbase'

const IndexPage: React.FC = () => {
  const { user, loginByEmailAsync, logoutAsync } = useFirebase()
  const { getTicketTagAsync, getTicketAsync, getTicketsByProjectIdAsync, createTicketAsync } = useTicket()
  const { showTicketModalAsync } = useModal()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [neko, setNeko] = useState('')
  const [ticketTag, setTicketTag] = useState<TicketTagAppModel>()
  const [ticket, setTicket] = useState<TicketAppModel>()

  const [projectId, setProjectId] = useState('')
  const [tickets, setTickets] = useState<TicketAppModel[]>()

  const handleLogin = useCallback(() => {
    if (!email || !password) return
    loginByEmailAsync(email, password)
      .then(() => alert('Logged in'))
      .catch(err => { throw err })
  }, [email, password])

  const handleLogout = useCallback(() => {
    logoutAsync()
      .then(() => alert('Logged out'))
      .catch(err => { throw err })
  }, [])

  const handleSearch = useCallback(() => {
    if (!neko) return
    getTicketTagAsync(neko)
      .then(setTicketTag)
      .catch(err => { throw err })
  }, [neko])

  const handleGetTickets = useCallback(() => {
    if (!projectId) return
    getTicketsByProjectIdAsync(projectId)
      .then(setTickets)
      .catch(err => { throw err })
  }, [projectId])

  const onTicketUpdate = useCallback((newTicket: TicketAppModel) => {
    setTickets(s => s?.map(ticket => ticket.id === newTicket.id ? newTicket : ticket))
  }, [])

  const handleShowTicket = useCallback((ticket: TicketAppModel) => {
    showTicketModalAsync(ticket, onTicketUpdate)
      .then(() => alert('Updated'))
      .catch(err => { throw err })
  }, [])

  const handleCreateTicket = useCallback(() => {
    const ticket: TicketCreatePayload = {
      projectId: 'hello-world',
      title: 'New Ticket',
      description: 'This is a new ticket.'
    }
    createTicketAsync(ticket)
      .then(() => alert('Created'))
      .catch(err => { throw err })
  }, [])

  useEffect(() => {
    if (!ticketTag) return
    getTicketAsync(ticketTag.ticketId)
      .then(setTicket)
      .catch(err => { throw err })
  }, [ticketTag])

  return (
    <DefaultLayout title="Index Page">
      <Container>
        <h1>Redbase</h1>
        {user
          ? (
            <FormSection>
              <FormItem>
                {user.email}
              </FormItem>
              <FormItem $inlined>
                <FormButton onClick={handleLogout}>
                  ログアウト
                </FormButton>
              </FormItem>
            </FormSection>
          )
          : (
            <FormSection>
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormInput
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  value={email} />
              </FormItem>
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormInput
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  value={password} />
              </FormItem>
              <FormItem $inlined>
                <FormButton onClick={handleLogin}>
                  ログイン
                </FormButton>
              </FormItem>
            </FormSection>
          )}

        <FormSection>
          <FormItem>
            <FormLabel>チケットID</FormLabel>
            <FormInput
              onChange={e => setNeko(e.target.value)}
              value={neko} />
          </FormItem>
          <FormItem $inlined>
            <FormButton onClick={handleSearch}>検索</FormButton>
          </FormItem>
        </FormSection>

        <ul>
          <li>チケット: #{ticket?.tag}</li>
          <li>Id: {ticket?.id}</li>
          <li>タイトル: {ticket?.title}</li>
          <li>内容: {ticket?.description}</li>
          <li>ステータス: {ticket?.status}</li>
        </ul>

        <FormSection>
          <FormItem>
            <FormLabel>プロジェクトID</FormLabel>
            <FormInput
              onChange={e => setProjectId(e.target.value)}
              placeholder="プロジェクトID"
              value={projectId} />
          </FormItem>
          <FormItem $inlined>
            <FormButton onClick={handleGetTickets}>プロジェクト設定</FormButton>
          </FormItem>
        </FormSection>

        <FormSection>
          <FormItem $inlined>
            <FormButton onClick={handleCreateTicket}>チケット作成</FormButton>
          </FormItem>
        </FormSection>

        <table className="touchable">
          <thead>
            <tr>
              <th>#</th>
              <th>ステータス</th>
              <th>タイトル</th>
              <th>更新日時</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.sort((a, b) => parseInt(b.tag) - parseInt(a.tag))
              .map(ticket => (
                <tr
                  key={ticket.id}
                  onClick={() => handleShowTicket(ticket)}>
                  <td>{ticket.tag}</td>
                  <td>{ticketStatusTypes[ticket.status]}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.updatedAt.toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Container>
    </DefaultLayout>
  )
}

export default IndexPage

const Container = styled.div`
  padding: 20px;
`
