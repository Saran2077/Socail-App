import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'
import userAtom from "../atom/userAtom"
import useShowToast from "../hooks/useShowToast"

const MessageInput = () => {
  const currentUser = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    if (!currentUser) return showToast("", "Login to chat", "error")
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recepientId: "asd",
          message: message
        })
      })
    } catch (error) {
      showToast("", error.message, "error")
    }
  }

  return (
    <form>
        <InputGroup>
          <Input w="full" placeholder='Type a message' onChange={(e) => setMessage(e.target.value)}/>
          <InputRightElement>
            <IoSendSharp onClick={sendMessage} />
          </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput