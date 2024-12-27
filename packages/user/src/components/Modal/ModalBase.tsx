import { useCallback, useEffect } from 'react'
import { PiX } from 'react-icons/pi'
import styled from 'styled-components'
import { ModalProps } from '../../providers/ModalProvider'
import FormButton from '../Form/FormButton'
import FormItem from '../Form/FormItem'
import FormSection from '../Form/FormSection'

interface ModalControlProps {
  modalProps: ModalProps
  handleOK: () => void
  handleCancel: () => void
}

const ModalBase: React.FC<ModalControlProps> = props => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.handleCancel()
    }
    else if (e.key === 'Enter') {
      props.handleOK()
    }
  }, [props.handleOK, props.handleCancel])

  useEffect(() => {
    if (!props.modalProps.isUsedCloseByKeyboard) return
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [props.modalProps.isUsedCloseByKeyboard, handleKeyDown])

  return (
    <Container>
      <TitleWrap>
        <Title>{props.modalProps.title}</Title>
        <Close>
          <CloseButton onClick={props.handleCancel}>
            <PiX />
          </CloseButton>
        </Close>
      </TitleWrap>
      <Body>
        {props.modalProps.children}
        {props.modalProps.type !== 'dialog' && (
          <Footer>
            <FormSection>
              <FormItem $inlined>
                <FormButton onClick={props.handleOK}>
                  {props.modalProps.type === 'confirm' ? 'はい' : 'OK'}
                </FormButton>
                {props.modalProps.type === 'confirm' && (
                  <FormButton onClick={props.handleCancel}>
                    いいえ
                  </FormButton>
                )}
              </FormItem>
            </FormSection>
          </Footer>
        )}
      </Body>
    </Container>
  )
}

export default ModalBase

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 50%;
  max-height: 90%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  
  @media screen and (max-width: 840px) {
    width: 90%;
  }
`
const TitleWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  background-color: #404040;
  color: white;
  border-radius: 10px 10px 0 0;
`
const Title = styled.div`
  font-weight: bold;
  padding: 10px;
`
const Close = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const CloseButton = styled.button`
  width: calc(28px + 10px);
  height: calc(28px + 10px);
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  svg {
    color: white;
    width: 100%;
    height: 100%;
  }
`
const Body = styled.div`
  overflow-y: auto;
  background-color: white;
  border-radius: 0 0 10px 10px;
`
const Footer = styled.div`
  text-align: right;
`
