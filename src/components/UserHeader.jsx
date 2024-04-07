import React, { useState } from 'react'
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { VStack, Flex, Box, Avatar, Text, Link, MenuButton, Menu, MenuItem, MenuList, Button, useToast } from '@chakra-ui/react'
import { Link as RouterLink} from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from "./../atom/userAtom.js"
import useShowToast from '../hooks/useShowToast.js';

const UserHeader = ({ user }) => {
  const showToast = useShowToast()
  const currentUser = useRecoilValue(userAtom)
  const setCurrentUser = useSetRecoilState(userAtom)
  const[updating, setUpdating] = useState(false)
  const[following, setFollowing] = useState(currentUser?.following.includes(user._id))
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    showToast("Copied to clipboard", "success")
  }
  const handleFollowUnfollow = async() => {
    if(!currentUser) {
        return
    }
    setUpdating(true)
    try {
        const res = await fetch(`/api/users/followUnfollow/${user._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        let updatedUser = {...currentUser}
        if(data.error) {
            showToast("", data.error, "error")
            return
        }
        updatedUser.following = following ? updatedUser.following.filter(id => id !== user._id)
        : [...updatedUser.following, user._id];
        following ? user.followers.filter(id => id != currentUser?.id) : user.followers.push(currentUser?.id)
        localStorage.setItem("user-info", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
        setFollowing(!following)
        showToast("", data.message, "success")
    } catch (error) {
        console.log("error", error)
    }
    finally {
        setUpdating(false)
    }
  }

  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w="full">
            <Box>
                <Text fontSize={
                    {
                        base: "md",
                        md: "xl"
                    }
                } fontWeight={"bold"}>{ user.name }</Text>
                <Flex alignItems={"center"} gap={"2"}>
                    <Text fontSize={
                        {
                            base: "xs",
                            md: "sm"
                        }
                    }>{ user.username }</Text>
                    <Text fontSize={{
                        base: "xs",
                        md: "sm"
                    }} bg={"gray.dark"} color={"gray.light"} borderRadius={"full"} padding={1}>threads.net</Text>
                </Flex>
            </Box>
            
            <Box>
                <Avatar 
                    name={ user.name }
                    src={ user.profilePic ? user.profilePic : null }
                    size={{
                        base: "md",
                        md: "xl"
                    }}
                />
            </Box>

        </Flex>
        <Text fontSize={
            {
                base: "sm",
                md: "md"
            }
        }>{ user.bio }</Text>
        {currentUser?.id === user._id && 
        <RouterLink to="/update">
            <Button>Update Profile</Button>
        </RouterLink>}
        {currentUser?.id !== user._id && 
            <Button onClick={handleFollowUnfollow} isLoading={updating}>{!following ? "Follow" : "Unfollow"}</Button>}
        <Flex w="full" justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>
                    { user.followers.length } Followers
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
    
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"}/>
                        </MenuButton>
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={ copyUrl }>Copy Link</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
        <Flex w="full" justifyContent={"space-between"}>
            <Flex pb="3" borderBottom="1.5px solid white" cursor="pointer" flex="1" justifyContent={"center"}>
            <   Text fontWeight={"bold"}>Threads</Text> 
            </Flex>
            <Flex pb="3" borderBottom="1px solid gray" color={"gray.light"} cursor={"pointer"} flex="1" justifyContent={"center"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader