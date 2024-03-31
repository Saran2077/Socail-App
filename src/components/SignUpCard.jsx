import { Box, Button, Container, Flex, FormControl, Input, InputGroup, InputRightElement, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atom/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atom/userAtom";

const SignUpCard = () => {
  const [show, setShow] = useState(false)
  const setAuth = useSetRecoilState(authScreenAtom)
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })
  const showToast = useShowToast()
  const setUser = useSetRecoilState(userAtom)
  
  const handleSignUp = async() => {
    try {
        const res = await fetch("/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputs)
        })

        const data = await res.json()
        console.log(data)
        if(data.error) {
            showToast("", data.error, "error")
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
        <Text mb="8" fontSize="xl" fontWeight={"bold"}>Sign Up</Text>
        <VStack gap={5} bg={useColorModeValue("white", "gray.dark")} py="10" px="5" borderRadius={6}>
            <Flex gap="3">
                <Flex flexDirection={"column"} gap="10px">
                <Text fontWeight={"bold"} fontSize={"sm"}>Full Name</Text>
                <Input 
                onChange={(e) => setInputs({...inputs, name: e.target.value})}
                placeholder="Full Name"
                />
                </Flex>
                <Flex flexDirection={"column"} gap="10px">
                    <Text fontWeight={"bold"} fontSize={"sm"}>Username</Text>
                    <Input 
                    onChange={(e) => setInputs({...inputs, username: e.target.value})}
                    placeholder="Username"
                    />
                </Flex>
            </Flex>
            <Flex flexDirection={"column"} gap="10px" w="full">
                <Text fontWeight={"bold"} fontSize={"sm"}>Email Address</Text>
                <Input 
                  onChange={(e) => setInputs({...inputs, email: e.target.value})}
                  placeholder="Email"
                />
            </Flex>
            <Flex flexDirection={"column"} gap="10px" w="full">
                <Text fontWeight={"bold"} fontSize={"sm"}>Password</Text>
                <InputGroup>
                    <Input 
                        onChange={(e) => setInputs({...inputs, password: e.target.value})}
                        placeholder="Password"
                        type={show ? "text" : "password"}
                    />
                    <InputRightElement>
                        <Button size="ld" onClick={() => setShow(!show)}>
                            {show ? <FaRegEye /> : <FaRegEyeSlash />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Flex>
            <Button
             mb={5} 
             loadingText="Submitting"
             w="full"
             bg={useColorModeValue("gray.600", "gray.700")}
             color="white"
             onClick={handleSignUp}
             _hover={{
                bg: "blue.500"
             }}
             >
                Sign Up
            </Button>
            <Flex>
                <Text pr={2}>Already a user?</Text>
                <Text cursor={"pointer"} onClick={() => setAuth("login")}>Log in</Text>
            </Flex>
        </VStack>
    </VStack>
  )
}

export default SignUpCard