import React from 'react'
import { Message } from 'semantic-ui-react'

interface Props{
    message : string
}
const FloatingMessage = ({message} : Props) => <Message floating>{message}</Message>

export default FloatingMessage