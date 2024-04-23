import { Avatar, AvatarBadge, Box, Flex, Text, WrapItem, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atom/userAtom'
import conversationAtom from '../atom/conversationAtom'

const Conversation = ({ conversation }) => {
  const[receiver, setReceiver] = useState(null)
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const setCurrentConversation = useSetRecoilState(conversationAtom)
  const opponent = conversation?.participants.filter((id) => id != user.id)

  useEffect(() => {
    const getReceiver = async() => {
        try {
            const res = await fetch(`/api/users/getUser/${opponent[0]}`)
            const data = await res.json()
            if (data.error) return showToast("", data.error, "error")

            setReceiver(data)
        } catch (error) {
            console.log(error)
        }
    }
    getReceiver()
  }, [conversation])

  return (
    <Flex onClick={() => setCurrentConversation(conversation)} alignItems={"center"} gap={4} p={"1"} _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.400"),
        color: "white"
    }} borderRadius={"md"}>
        <Avatar size={{
            base: "xs",
            sm: "sm",
            md: "md"
        }} name={conversation?.username} src={conversation?.profilePic}>
            <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
        <Flex flexDirection={"column"}>
            <Text fontWeight={700} display={"flex"} alignItems={"center"}>{conversation?.username}</Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>{conversation?.lastMessage.text}</Text>
        </Flex>
    </Flex>
  )
}

export default Conversation