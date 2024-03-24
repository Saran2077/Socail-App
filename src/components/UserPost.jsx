import { Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { React, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

const UserPost = ({ postImage, postTitle, likes, replies }) => {
  const [liked, setLiked] = useState(false)
  const handleDownload = () => {
    console.log("Downloading")
    window.location.href = postImage 
  }

  return (
    <Link to={"posts/id"}>
        <Flex mt="10" gap={4}>
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
                        <Menu>
                            <MenuButton>
                                <BsThreeDots />
                            </MenuButton>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={() => handleDownload(postImage)}>Download</MenuItem>
                                <MenuItem bg={"gray.dark"}>Copy</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
                <Flex flexDirection={"column"} gap={4}>
                    <Text fontSize={"xs"}>
                        {postTitle}
                    </Text>
                    {postImage && <Image 
                        src={ postImage }
                        borderRadius={"10"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                    />}

                </Flex>
                <Actions 
                    liked={ liked } 
                    setLiked={ setLiked }
                />
                <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize="sm">
                    {replies}{replies <= 1 ? " reply" : " replies"}
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {likes}{likes <= 1 ? " like" : " likes"}
                </Text>
            </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost