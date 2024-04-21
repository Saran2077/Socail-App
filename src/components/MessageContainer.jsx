import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToast'

const MessageContainer = ({ currentConversation }) => {
  const showToast = useShowToast()
  const[messages, setMessages] = useState([])
  const[isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMessages = async() => {
        try {
            const res = await fetch(`/api/messages/${currentConversation._id}`)
            const data = await res.json()
            if (data.error) {
                return showToast("", data.error, "error")
            }
            setMessages(data)
            console.log(data)

        } catch (error) {
            showToast("", error.message, "error")
        } finally {
            setIsLoading(false)
        }
    }
    getMessages()
  }, [currentConversation])

  return (
    <Flex flex={70} p={2} gap={1} flexDirection={"column"} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"}>
        <Flex w="full" h={12} alignItems={"center"} gap={2}>
            <Avatar size={"sm"} name={currentConversation?.username} src={currentConversation?.profilePic} />
            <Text>
                {currentConversation?.username}
            </Text>
        </Flex>
        <Divider />
        <Flex flexDirection={"column"} justifyContent={"flex-end"} gap={4} ml={1} px={2} height={"400px"} overflowY={"auto"}>
            {isLoading && (
                [0, 1, 2, 3, 4].map((i) => (
                    <Flex w="full" gap={2} alignItems={"center"}  flexDirection={i%2==0 ? "row" : "row-reverse"}>
                        <SkeletonCircle size={10} />
                        <Skeleton h={4} w={200}/>
                    </Flex>
                ))
            )}
            {messages && messages.map((message) => (
                <Message message={message} /> 
            ))}
        </Flex>
        <MessageInput />
    </Flex>
  )
}

export default MessageContainer