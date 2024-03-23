import { Avatar, Box, Flex, Image, Stack, Text } from '@chakra-ui/react'
import { React, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

const UserPost = () => {
  const [liked, setLiked] = useState(false)

  return (
    <Link>
        <Flex mt="5" gap={4}>
            <Stack alignItems={"center"}>
                <Image 
                src='/zuck-avatar.png'
                w="10"
                borderRadius={"50%"}
                />
                <Box h="full" borderRadius={"10"} w="1px" bg="gray.light" my="2px"></Box>
                <Box w="fullxs" position={"relative"}>
                    <Avatar 
                        src="/zuck-avatar.png"
                        position={"absolute"}
                        top={"-2px"}
                        left={"-8px"}
                        size={"xs"}
                        padding={"2px"}
                        />
                    <Avatar 
                        src="/zuck-avatar.png"
                        position={"absolute"}
                        bottom={0}
                        right={"0px"}
                        size={"xs"}
                        padding={"2px"}
                        />
                    <Avatar 
                        src="/zuck-avatar.png"
                        position={"absolute"}
                        bottom={0}
                        // left={"4px"}
                        size={"xs"}
                        padding={"2px"}
                    />
                </Box>
            </Stack>
            <Flex w="full" flexDirection={"column"} gap={2}>
                <Flex w="full" justifyContent={"space-between"}>
                    <Text fontWeight={"bold"} fontSize={"xs"}>Saran</Text>
                    <Flex gap={4} alignContent={"center"}>
                        <Text color={"gray.light"} fontSize={"xs"}>1d</Text>
                        <BsThreeDots />
                    </Flex>
                </Flex>
                <Flex flexDirection={"column"} gap={4}>
                    <Text fontSize={"xs"}>
                        This is my first post
                    </Text>
                    <Image 
                        src='/post1.png'
                        borderRadius={"10"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                    />

                </Flex>
                <Actions 
                    liked={ liked } 
                    setLiked={ setLiked }
                />
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost