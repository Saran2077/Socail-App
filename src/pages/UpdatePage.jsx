import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewImg.js'
import useShowToast from '../hooks/useShowToast.js'
import { useRecoilState } from 'recoil'
import userAtom from "./../atom/userAtom.js"

export default function UpdatePage() {
  const[updating, setUpdating] = useState(false)
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
  })
  const showToast = useShowToast()

  const handleSubmit = async() => {
    if (updating) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/users/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({...inputs, profilePic: imgUrl })
      })
      const data = await res.json()
      if (data.error) {
        showToast("", "Profile update failed", "error")
        return 
      }
      showToast("", "Profile updated sucessfully", "success")
      setUser(data);
			localStorage.setItem("user-info", JSON.stringify(data));
    } catch (error) {
      showToast("", error, "error")    
    } finally {
      setUpdating(false)
    }
  }

  const { imgUrl, handleImageChange } = usePreviewImg()

  const fileRef = useRef(null)

  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={6}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgUrl ? imgUrl : user.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' ref={fileRef} hidden onChange={(e) => handleImageChange(e)} />
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Fullname"
            value={inputs.name}
            onChange={(e) => setInputs({...inputs, name: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            value={inputs.bio}
            onChange={(e) => setInputs({...inputs, bio: e.target.value})}
            placeholder="Your bio."
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            value={inputs.username}
            onChange={(e) => setInputs({...inputs, username: e.target.value})}
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            onChange={(e) => setInputs({...inputs, email: e.target.value})}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setInputs({...inputs, password: e.target.value})}
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            onClick={handleSubmit}
            isLoading={updating}
            _hover={{
              bg: 'green.500',
            }}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}