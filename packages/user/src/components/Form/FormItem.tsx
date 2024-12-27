import styled from 'styled-components'

const FormItem = styled.div<{ $inlined?: boolean }>`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }

  display: flex;
  flex-flow: ${props => (props.$inlined ? 'row' : 'column')};
  gap: 5px;
`

export default FormItem
