import { AddIcon } from "@chakra-ui/icons"
import { Button, useDisclosure, ModalOverlay, ModalContent, Modal, ModalHeader, ModalCloseButton, ModalBody, Textarea, FormControl, Divider, ModalFooter, Avatar, Flex, Text, Input, Stack, Image, CloseButton, Box } from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import { BsImageFill } from "react-icons/bs"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atom/userAtom"
import useShowToast from "../hooks/useShowToast"
import postAtom from "../atom/postAtom"

const MAX_CHAR = 500

const CreatePost = () => {
  const {isOpen, onOpen, onClose } = useDisclosure()
  const[postText, setPostText] = useState("")
  const { imgUrl, handleImageChange, setImgUrl } = usePreviewImg()
  const fileRef = useRef(null)
  const[remainingChar, setRemainingChar] = useState(MAX_CHAR)
  const[isLoading, setIsLoading] = useState(false)
  const showToast = useShowToast()
  const user = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postAtom)

  const handleTextChange = async(e) => {
    let inputText = e.target.value 
    if (inputText.length > 500) {
        inputText = inputText.slice(0, MAX_CHAR)
        setRemainingChar(0)
    }
    setPostText(inputText)
    setRemainingChar(MAX_CHAR-inputText.length)
  }

  const handlePost = async() => {
    if(!postText) {
        showToast("", "Write something to post", "error")
        return
    }
    setIsLoading(true)
    try {
        const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: postText,
                img: imgUrl
            })
        })
        const data = await res.json()
        if (data.error) {
            showToast("", data.error, "error")
        }
        else {
            showToast("", data.message, "success")
            setImgUrl(null)
            setPostText("")
            onClose()
            setPosts([...posts, data.post])
        }
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }

  }

  return (
    <>
      <Button
       position={"fixed"}
       bottom={10}
       right={5}
       onClick={onOpen}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired> 
                <Flex gap={4}>
                    <Avatar
                        name={user.name}
                        src={user.profilePic}
                    />
                    <Flex w="full" flexDirection={"column"}>
                        <Textarea
                            w={"full"}
                            border={"none"}
                            placeholder="Write Anything"
                            onChange={(e) => handleTextChange(e)}
                            value={postText}
                            h={"auto"}
                            maxH={"500px"}
                        />
                        {imgUrl && 
                            <Box position={"relative"}>
                                <Image
                                    src={imgUrl}
                                    
                                />
                                <CloseButton 
                                    position={"absolute"}
                                    bg={"gray.800"}
                                    top={2}
                                    right={2}
                                    color={"white"}
                                    onClick={() => setImgUrl(null)}
                                />
                            </Box>
                        }
                    </Flex>
                </Flex>
            </FormControl>
            <Text m={2} fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} color={"gray.800"}>{remainingChar}/500</Text>
          </ModalBody>
          <Divider />
          <ModalFooter p={1}>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Button bg="transparent" onClick={() => fileRef.current.click()} p={0}><BsImageFill /></Button>
                <Button borderRadius={20} p={5} isLoading={isLoading} onClick={handlePost}>Post</Button>
            </Flex>
            <Input type="file" onChange={handleImageChange} ref={fileRef} hidden/>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost