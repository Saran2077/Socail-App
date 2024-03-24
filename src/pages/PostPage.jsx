import { Avatar, Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comments from '../components/Comments'

const PostPage = ( {userAvatar, username, image, title, created, likes, replies } ) => {
  return (
    <Flex flexDirection={"column"} gap="4">
      <Flex w="full" justifyContent={"space-between"}>
        <Flex gap="2" alignItems={"center"}>
          <Avatar 
            name={username}
            src={userAvatar}
            size="md"
          />
          <Text fontSize={"sm"} fontWeight={"bold"}>{ username }</Text>
        </Flex>
        <Flex alignItems={"center"} gap="3">
          <Text fontSize={"xs"} color={"gray.light"}>{ created }</Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text>{ title }</Text>
      <Box overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} borderRadius={"10"}>
        <Image
          src={ image }
        />
      </Box>
      <Actions />
      <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize="sm">
                    {replies}{replies <= 1 ? " reply" : " replies"}
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {likes}{likes <= 1 ? " like" : " likes"}
                </Text>
            </Flex>
      
      <Divider />
      <Comments
        userAvatar="Saran2077"
        username="https://bit.ly/kent-c-dodds"
        comment="Hey Nice man"
        created="1d"
        likes={100}
      />
      <Comments
        userAvatar="Saran2077"
        username="https://bit.ly/kent-c-dodds"
        comment="Hey Nice man"
        created="1d"
        likes={100}
      />
    </Flex>
  )
}

export default PostPage