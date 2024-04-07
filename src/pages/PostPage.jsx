import { Avatar, Box, Button, Divider, Flex, Image, Text, useDisclosure, Modal, ModalContent, ModalBody } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Actions from '../components/Actions'
import Comments from '../components/Comments'
import { useNavigate, useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import postAtom from "./../atom/postAtom.js"
import useGetUser from '../hooks/useGetUser.js'
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons'
import userAtom from '../atom/userAtom.js'

const PostPage = () => {
  const {  pid } = useParams()
  const[post, setPost] = useState(null)
  const [ posts, setPosts ] = useRecoilState(postAtom)
  const showToast = useShowToast()
  const { user, isLoading } = useGetUser()
  const currentUser = useRecoilValue(userAtom)
  const [deleting, setDeleting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const handleDeletePost = async(e) => {
    setDeleting(true)
    try {
        const res = await fetch(`/api/posts/${pid}`, {
            method: "DELETE"
        })
        const data = await res.json()
        if (data.error) {
            showToast("", data.error, "error")
            return
        }
        onClose()
        showToast("", data.message, "success")
        setPosts(posts.filter((posta) => posta._id != post._id))
        navigate(`/${user?.username}`)
    } catch (error) {
        console.log(error)
    } finally {
        setDeleting(false)
    }
  }


  useEffect(() => {
    const getPost = async() => {
      try {
        const res = await fetch("/api/posts/"+pid)
        const data = await res.json()
        if (data.error) {
          return showToast("", data.error, "error")
        }
        setPost(data)
        
      } catch (error) {
        showToast("", error, "error")
      }
    }
    getPost()
  }, [pid])

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
          <Flex gap={2} alignItems={"center"}>
            <Text>{ post && formatDistanceToNow(post?.createdAt) }</Text>
            {post?.postedBy === currentUser?.id && <DeleteIcon cursor={"pointer"} onClick={onOpen}/>}
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
          </Flex>
        </Flex>
      </Flex>
      <Text>{ post?.text }</Text>
      <Box overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} borderRadius={"10"}>
        <Image
          src={ post?.img }
        />
      </Box>
      { post && <Actions post={post}/> }
      
      <Divider />
      {post?.replies.map((reply) => (
        <Comments reply={reply} />
      ))}
    </Flex>
  )
}

export default PostPage