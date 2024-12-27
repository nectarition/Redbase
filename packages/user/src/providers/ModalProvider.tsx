import { createContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import ModalBase from '../components/Modal/ModalBase'

export interface ModalProps {
  title: React.ReactNode
  type: 'alert' | 'confirm' | 'dialog'
  children: React.ReactNode
  isUsedCloseByKeyboard?: boolean
  isUsedCloseByClickOutside?: boolean
  actionAsync?: () => Promise<void>
  cancelActionAsync?: () => Promise<void>
}

interface Props {
  children: React.ReactNode
}

const ModalProvider: React.FC<Props> = props => {
  const [isShow, setIsShow] = useState(false)

  const [modalProps, setModalProps] = useState<ModalProps>({
    title: '',
    type: 'alert',
    children: null
  })
  const [handleOK, setHandleOK] = useState(() => () => {})
  const [handleCancel, setHandleCancel] = useState(() => () => {})

  const showModalAsync = useCallback(async (props: ModalProps) => {
    return new Promise<void>((resolve, reject) => {
      setIsShow(true)
      setModalProps(props)
      setHandleOK(() => () => {
        if (props.actionAsync) {
          props.actionAsync()
            .then(() => {
              setIsShow(false)
              resolve()
            })
          return
        }
        setIsShow(false)
        resolve()
      })
      setHandleCancel(() => () => {
        if (props.cancelActionAsync) {
          props.cancelActionAsync()
            .then(() => {
              setIsShow(false)
              reject(new Error('Modal canceled'))
            })
          return
        }
        setIsShow(false)
        reject()
      })
    })
  }, [])

  return (
    <ModalContext.Provider value={showModalAsync}>
      <Container>
        {props.children}
        {isShow && (
          <ModalWrap onClick={e => modalProps.isUsedCloseByClickOutside && e.target === e.currentTarget && handleCancel()}>
            <ModalBase
              handleCancel={handleCancel}
              handleOK={handleOK}
              modalProps={modalProps} />
          </ModalWrap>
        )}
      </Container>
    </ModalContext.Provider>
  )
}
export default ModalProvider

export const ModalContext = createContext(async (_: ModalProps) => {})

const Container = styled.div`
  width: 100%;
  height: 100%;
`
const ModalWrap = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`
