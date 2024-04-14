import { Avatar, AvatarBadge, Box, Flex, Text, WrapItem, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const Conversation = () => {
  return (
    <Flex alignItems={"center"} gap={4} p={"1"} _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.400"),
        color: "white"
    }} borderRadius={"md"}>
        <Avatar size={{
            base: "xs",
            sm: "sm",
            md: "md"
        }} name="Saran">
            <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
        <Flex flexDirection={"column"}>
            <Text fontWeight={700} display={"flex"} alignItems={"center"}>Saran</Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>Hello some Message...</Text>
        </Flex>
    </Flex>
  )
}

export default Conversation