import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import Message from './Message'

const MessageContainer = () => {
  return (
    <Flex flex={70} p={2} flexDirection={"column"} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"}>
        <Flex w="full" h={12} alignItems={"center"} gap={2}>
            <Avatar size={"sm"} src="" />
            <Text>
                saran
            </Text>
        </Flex>
        <Divider />
        <Flex flexDirection={"column"} gap={4} ml={1} px={2} height={"400px"} overflowY={"auto"}>
            {true && (
                [0, 1, 2, 3, 4].map((i) => (
                    <Flex w="full" gap={2} alignItems={"center"}  flexDirection={i%2==0 ? "row" : "row-reverse"}>
                        <SkeletonCircle size={10} />
                        <Skeleton h={4} w={200}/>
                    </Flex>
                ))
            )}
            {BiMessageSquare.map((message) => (
                <Message message={ message}/>
            ))}
        </Flex>
    </Flex>
  )
}

export default MessageContainer