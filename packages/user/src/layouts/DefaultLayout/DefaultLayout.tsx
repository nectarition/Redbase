import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

interface Props {
  children: React.ReactNode
  title: string
}
const DefaultLayout: React.FC<Props> = props => {
  const title = useMemo(() => `${props.title} - Redbase`, [props.title])
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {props.children}
    </>
  )
}

export default DefaultLayout
