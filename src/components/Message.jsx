import { Flex, Avatar, Text } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from "./../atom/userAtom.js"
import conversationAtom from '../atom/conversationAtom.js'

const Message = ({ message }) => {
  const currentUser = useRecoilValue(userAtom)
  const currentConversation = useRecoilValue(conversationAtom)
  return (
   <Flex
    gap={2}
    flexDirection={message.sender === currentUser.id ? "row-reverse" : "row"}
   >
     <Avatar src={message.sender === currentUser.id ? currentUser.profilePic : currentConversation.profilePic} w={7} h={7} />
     <Text maxW="350px" bg={message.sender === currentUser.id ? "blue.400" : "gray.400"} color={message.sender === currentUser.id ? "white" : "black"} p={1} borderRadius={"md"}>
        {message.text} 
     </Text>
   </Flex>
  )
}

export default Message