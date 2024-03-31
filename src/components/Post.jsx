import { Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { React, useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast'

const UserPost = ({ feed }) => {
  console.log(feed.text)
  const [liked, setLiked] = useState(false)
  const handleDownload = () => {
    console.log("Downloading")
    window.location.href = feed.img 
  }
  const[user, setUser] = useState(null)
  const userId = feed.postedBy 
  const showToast = useShowToast()
  useEffect(() => {
    const getUser = async() => {
        try {
            const res = await fetch(`/api/users/getUser/${userId}`)
            const data = await res.json()
            if (data.error) {
                useShowToast("", data.error, "error")
                return
            }
            setUser(data)
        } catch (error) {
            console.log(error)
        }
    }
    getUser()
  }, [userId])
  return (
    <Link to={"posts/id"}>
        <Flex mt="10" gap={4}>
            <Stack alignItems={"center"}>
                <Image 
                src={user && user.profilePic}
                w="10"
                borderRadius={"50%"}
                />
                <Box h="full" borderRadius={"10"} w="1px" bg="gray.light" my="2px"></Box>
                <Box w="fullxs" position={"relative"}>
                    <Avatar 
                        src={user && user.profilePic}
                        name={user && user.name}
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
                    <Text fontWeight={"bold"} fontSize={"xs"}>{ user && user.username }</Text>
                    <Flex gap={4} alignContent={"center"}>
                        <Text color={"gray.light"} fontSize={"xs"}>1d</Text>
                        <Menu>
                            <MenuButton>
                                <BsThreeDots />
                            </MenuButton>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={() => handleDownload()}>Download</MenuItem>
                                <MenuItem bg={"gray.dark"}>Copy</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
                <Flex flexDirection={"column"} gap={4}>
                    <Text fontSize={"xs"}>
                        { feed.text }
                    </Text>
                    {feed.img && <Image 
                        src={ feed.img || null }
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
                    {feed.likes.length}{feed.likes.length <= 1 ? " like" : " likes"}
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {feed.replies.length}{feed.replies.length <= 1 ? " reply" : " replies"}
                </Text>
            </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost