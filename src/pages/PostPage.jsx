import { Avatar, Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comments from '../components/Comments'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import postAtom from "./../atom/postAtom.js"

const PostPage = () => {
  const { username, pid } = useParams()
  const[post, setPost] = useState(null)
  const posts = useRecoilValue(postAtom)
  const setPosts = useRecoilState(postAtom)
  const showToast = useShowToast()
  const[user, setUser] = useState(null)
  useEffect(() => {
    const getPost = async() => {
      try {
        const res = await fetch("/api/posts/"+pid)
        const data = await res.json()
        if (data.error) {
          return showToast("", data.error, "error")
        }
        setPost(data)
        console.log(data)
        
      } catch (error) {
        showToast("", error, "error")
      }
    }
    getPost()
  }, [pid])

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch("/api/users/getUserProfile/"+username)
        const data = await res.json()
        if (data.error) {
          showToast("", data.error, "error")
          return 
        }
        setUser(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [username])



  return (
    <Flex flexDirection={"column"} gap="4">
      <Flex w="full" justifyContent={"space-between"}>
        <Flex gap="2" alignItems={"center"}>
          <Avatar 
            name={user?.username}
            src={user?.profilePic}
            size="md"
          />
          <Text fontSize={"sm"} fontWeight={"bold"}>{ user?.username }</Text>
        </Flex>
        <Flex alignItems={"center"} gap="3">
          <Text fontSize={"xs"} color={"gray.light"}>{ "" }</Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text>{ post?.text }</Text>
      <Box overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} borderRadius={"10"}>
        <Image
          src={ post?.img }
        />
      </Box>
      <Actions feed={post}/>
      <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize="sm">
                    {post?.replies.length}{post?.replies.length <= 1 ? " reply" : " replies"}
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {post?.likes.length}{post?.likes.length <= 1 ? " like" : " likes"}
                </Text>
            </Flex>
      
      <Divider />
      {post?.replies.map((reply) => (
        <Comments reply={reply} />
      ))}
    </Flex>
  )
}

export default PostPage