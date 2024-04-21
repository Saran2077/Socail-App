import { Search2Icon } from '@chakra-ui/icons'
import { Box, Button, Container, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast'
import conversationAtom from '../atom/conversationAtom.js'
import { useRecoilValue } from 'recoil'

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const[conversations, setConversations] = useState([])
  const showToast = useShowToast()
  const currentConversation = useRecoilValue(conversationAtom)

  useEffect(() => {
    const getConversations = async() => {
      try {
        const res = await fetch("api/messages/conversations")
        const data = await res.json()
        if (data.error) {
          return showToast("", data.error, "error")
        }
        console.log(data)
        setConversations(data)
      } catch (error) {
        useShowToast("", error.message, "error")
      } finally {
        setIsLoading(false)
      }
    }
    getConversations()
  }, [])

  return (
    <Box position={"absolute"} left={"50%"} transform={"translateX(-50%)"} p={4} w={{
      base: "100%",
      md: "80%",
      lg: "750px"
    }}>
      <Flex gap={4} flexDirection={{
          base: "column",
          md: "row"
        }} maxW={{
          sm: "400px",
          md: "full"
        }} mx={"auto"}>
          <Flex  flex={30} flexDirection={"column"} gap={2}>
            <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
              Your Conversations 
            </Text>
            <form>
              <Flex alignItems={"center"} gap={2}>
                <Input placeholder='Search for a user' />
                <Button size="sm"><Search2Icon /></Button>
              </Flex>
            </form>
            {isLoading && (
              [0, 1, 2, 3, 4, 5].map((i) => (
                <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  <Flex w="full" flexDirection={"column"} gap={3}>
                    <Skeleton height={"10px"} width={"80px"} />
                    <Skeleton height={"8px"} width={"90%"} />
                  </Flex>
                </Flex>
              ))
            )}

            {conversations.length > 0 ? (
              conversations.map((conversation) => {
                return (
                  <Conversation key={conversation.id} conversation={conversation} />
                )
              })
            ) : (
              <></>
            )}
          </Flex>
          {!currentConversation ? (<Flex flex={70} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
            <GiConversation size={100}/>
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>)
          :
          (<MessageContainer currentConversation={currentConversation}/>)}
      </Flex>
    </Box>
  )
}

export default ChatPage