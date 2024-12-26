import { useCallback, useEffect, useState } from 'react'
import useFirebase from '../../hooks/useFirebase'
import useTicket from '../../hooks/useTicket'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { TicketAppModel, TicketTagAppModel } from 'redbase'

const IndexPage: React.FC = () => {
  const { user, loginByEmailAsync, logoutAsync } = useFirebase()
  const { getTicketTagAsync, getTicketAsync } = useTicket()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [neko, setNeko] = useState('')
  const [ticketTag, setTicketTag] = useState<TicketTagAppModel>()
  const [ticket, setTicket] = useState<TicketAppModel>()

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

  useEffect(() => {
    if (!ticketTag) return
    getTicketAsync(ticketTag.ticket.id)
      .then(setTicket)
      .catch(err => { throw err })
  }, [ticketTag])

  return (
    <DefaultLayout title="Index Page">
      <h1>Index Page</h1>
      {user
        ? (
          <p>
            <>{user.email}</>
            <button onClick={handleLogout}>Logout</button>
          </p>
        )
        : (
          <p>
            <input
              onChange={e => setEmail(e.target.value)}
              type="email"
              value={email} />
            <input
              onChange={e => setPassword(e.target.value)}
              type="password"
              value={password} />
            <button onClick={handleLogin}>Login</button>
          </p>
        )}
      <p>
        <input
          onChange={e => setNeko(e.target.value)}
          value={neko} />
        <button onClick={handleSearch}>Search</button>

        <ul>
          <li>チケット: #{ticket?.tag}</li>
          <li>Id: {ticket?.id}</li>
          <li>タイトル: {ticket?.title}</li>
          <li>内容: {ticket?.description}</li>
          <li>ステータス: {ticket?.status}</li>
        </ul>
      </p>

    </DefaultLayout>
  )
}

export default IndexPage
