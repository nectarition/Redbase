import { useMemo } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'

interface Props {
  children: React.ReactNode
  title: string
}
const DefaultLayout: React.FC<Props> = props => {
  const title = useMemo(() => `${props.title} - Redbase`, [props.title])
  return (
    <Container>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {props.children}
    </Container>
  )
}

export default DefaultLayout

const Container = styled.div`
  border-top: 8px solid var(--brand-color);
`
