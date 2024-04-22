import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from "../atom/userAtom"
import conversationAtom from "../atom/conversationAtom"
import useShowToast from "../hooks/useShowToast"
import messageAtom from '../atom/messageAtom'

const MessageInput = () => {
  const currentUser = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const currentMessage = useRecoilValue(conversationAtom)
  const messages = useRecoilValue(messageAtom)
  const [message, setMessage] = useState("")
  const setMessages = useSetRecoilState(messageAtom)

  const sendMessage = async () => {
    if (!currentUser) return showToast("", "Login to chat", "error")
    try {
      const recepientId = currentMessage?.participants.filter((id) => id != currentUser.id)[0]
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recepientId: recepientId,
          message: message
        })
      })
      const data = await res.json()
      if (data.error) {
        return showToast("", data.error, "error")
      }
      setMessages([...messages, data])
    } catch (error) {
      showToast("", error.message, "error")
    }
  }

  return (
    <form>
        <InputGroup>
          <Input w="full" placeholder='Type a message' onChange={(e) => setMessage(e.target.value)}/>
          <InputRightElement>
            <IoSendSharp cursor="pointer" onClick={sendMessage} />
          </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput