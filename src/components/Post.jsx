import { Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { React, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast'
import { formatDistanceToNow } from "date-fns"
import { DeleteIcon, WarningIcon } from '@chakra-ui/icons'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atom/userAtom'
import postAtom from '../atom/postAtom'


const Post = ({ feed }) => {
  const currentUser = useRecoilValue(userAtom)
  const posts = useRecoilValue(postAtom)
  const setPosts = useSetRecoilState(postAtom)
  const[deleting, setDeleting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const handleDeletePost = async(e) => {
    setDeleting(true)
    e.preventDefault()
    try {
        const res = await fetch(`/api/posts/${feed._id}`, {
            method: "DELETE"
        })
        const data = await res.json()
        if (data.error) {
            showToast("", data.error, "error")
            return
        }
        onClose()
        showToast("", data.message, "success")
        setPosts(posts.filter((post) => post._id != feed._id))
        console.log(posts)
    } catch (error) {
        console.log(error)
    } finally {
        setDeleting(false)
    }
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
                        src={ feed.replies[0].userProfilePic}
                        name={feed.replies[0].username}
                        position={"absolute"}
                        top={"-2px"}
                        left={"-10px"}
                        size={"xs"}
                        padding={"2px"}
                        />)}
                    {feed.replies[1] && (<Avatar 
                        src={feed.replies[1].userProfilePic}
                        name={feed.replies[1].username}
                        position={"absolute"}
                        bottom={0}
                        right={"3px"}
                        size={"xs"}
                        padding={"2px"}
                        />)}
                    {feed.replies[2] && (<Avatar 
                        src={feed.replies[2].userProfilePic}
                        name={feed.replies[2].username}
                        position={"absolute"}
                        bottom={0}
                        left={"4px"}
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
                        {currentUser?.id === feed.postedBy && <DeleteIcon onClick={
                            (e) => {
                                e.preventDefault()
                                onOpen()
                            }
                        } />}
                    </Flex>
                </Flex>
                <Modal isOpen={isOpen} isCentered>
                    <ModalContent bg={"gray.dark"}>
                        <ModalBody>
                            <Text fontSize={"lg"} m={7}>Do you want to delete the post?</Text>
                            <Flex w="full" justifyContent={"flex-end"} gap={6}>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button bg={"red"} leftIcon={<DeleteIcon />} isLoading={deleting} onClick={handleDeletePost}>Delete</Button>
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </Modal>
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
                    post={feed}
                />
            </Flex>
        </Flex>
    </Link>
  )
}

export default Post