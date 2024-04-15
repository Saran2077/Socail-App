import { Button, Flex, Input } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from "./../atom/userAtom.js"

const Message = ({ message }) => {
  const currentUser = useRecoilValue(userAtom)
  return (
   <Flex
    gap={2}
    flexDirection={currentUser.id === message.sentBy ? "row" : "row-reverse"}
   >
     <Avatar src="" />
     <Text maxW="350px" bg={currentUser.id === message.sentBy ? "blue.400" : "gray.400"} color={currentUser.id === message.sentBy ? "white" : "black"} p={1} borderRadius={"md"}>
        {message.message}
     </Text>
   </Flex>
  )
}

export default Message