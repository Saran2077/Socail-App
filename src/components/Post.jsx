import { Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { React, useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast'
import { formatDistanceToNow } from "date-fns"


const UserPost = ({ feed }) => {
  const [liked, setLiked] = useState(false)
  const handleDownload = () => {
    window.location.href = feed.img 
  }
  const[user, setUser] = useState(null)
  const userId = feed.postedBy 
  const showToast = useShowToast()
  const navigate = useNavigate()

  const handleRedirect = (e) => {
    e.preventDefault()
    navigate(`/${user.username}`)
  }

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
    <Link to={`/${user?.username}/posts/${feed?._id}`}>
        <Flex mt="10" gap={4}>
            <Stack alignItems={"center"}>
                <Avatar 
                src={user && user.profilePic}
                name={user?.name}
                onClick={handleRedirect}
                />
                <Box h="full" borderRadius={"10"} w="1px" bg="gray.light" my="2px"></Box>
                <Box w="fullxs" position={"relative"}>
                    {feed.replies.length === 0 && <Text align={"center"}>🥱</Text>}
                    {feed.replies[0] && (<Avatar 
                        src={ feed.replies[0].profilePic}
                        name={feed.replies[0].name}
                        position={"absolute"}
                        top={"-2px"}
                        left={"-8px"}
                        size={"xs"}
                        padding={"2px"}
                        />)}
                    {feed.replies[1] && (<Avatar 
                        src={feed.replies[1].profilePic}
                        name={feed.replies[1].name}
                        position={"absolute"}
                        bottom={0}
                        right={"0px"}
                        size={"xs"}
                        padding={"2px"}
                        />)}
                    {feed.replies[2] && (<Avatar 
                        src={feed.replies[2].profilePic}
                        name={feed.replies[2].name}
                        position={"absolute"}
                        bottom={0}
                        size={"xs"}
                        padding={"2px"}
                    />)}
                </Box>
            </Stack>
            <Flex w="full" flexDirection={"column"} gap={2}>
                <Flex w="full" justifyContent={"space-between"}>
                    <Text fontWeight={"bold"} onClick={handleRedirect} fontSize={"xs"}>{ user && user.username }</Text>
                    <Flex gap={4} alignContent={"center"}>
                        <Text color={"gray.light"} fontSize={"xs"}>{formatDistanceToNow(new Date(feed.createdAt))} ago</Text>
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
                    {feed.img && (
                        <Image 
                            src={ feed.img || null }
                            borderRadius={"10"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                        />)}

                </Flex>
                <Actions 
                    feed={feed}
                />
                
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost