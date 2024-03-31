import { Button, Flex, Input, InputGroup, InputRightElement, Text, VStack, useColorModeValue, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atom/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atom/userAtom";

const SignUpCard = () => {
  const setAuth = useSetRecoilState(authScreenAtom)
  const [show, setShow] = useState(false)
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })
  const [error, setError] = useState("")
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()
  const handleSubmit = async() => {
    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputs) 
        })

        const data = await response.json()
        if (data.error) {
            showToast("", data.error, 'error')
        }
        else {
            localStorage.setItem("user-info", JSON.stringify(data))
            setUser(data)
        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <VStack>
        <Text mb="8" fontSize="xl" fontWeight={"bold"}>Log in</Text>
        <VStack w={{
            base: "full",
            "sm": "400px"
        }} gap={5} bg={useColorModeValue("white", "gray.dark")} py="10" px="5" borderRadius={6}>
            <Flex gap="3">
            </Flex>
            <Flex flexDirection={"column"} gap="10px" w="full">
                <Text fontWeight={"bold"} fontSize={"md"}>Username</Text>
                <Input 
                    placeholder="Username"
                    onChange={(e) => setInputs({...inputs, username: e.target.value})}
                    />
            </Flex>
            <Flex flexDirection={"column"} gap="10px" w="full">
                <Text fontWeight={"bold"} fontSize={"md"}>Password</Text>
                <InputGroup>
                    <Input 
                        placeholder="Password"
                        onChange={(e) => setInputs({...inputs, password: e.target.value})}
                        type={show ? "text" : "password"}
                    />
                    <InputRightElement>
                        <Button size="ld" onClick={() => setShow(!show)}>
                            {show ? <FaRegEye /> : <FaRegEyeSlash />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Flex>
            {error}
            <Button
             mb={5} 
             loadingText="Submitting"
             w="full"
             bg={useColorModeValue("gray.600", "gray.700")}
             color="white"
             _hover={{
                bg: "blue.500"
             }}
             onClick={handleSubmit}
             >
                Log in
            </Button>
            <Flex>
                <Text pr={2}>Create new account</Text>
                <Text cursor={"pointer"} onClick={() => setAuth("")} pr={2}>Sign Up</Text>
            </Flex>
        </VStack>
    </VStack>
  )
}

export default SignUpCard