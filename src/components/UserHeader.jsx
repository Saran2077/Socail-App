import React from 'react'
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { VStack, Flex, Box, Avatar, Text, Link, MenuButton, Menu, MenuItem, MenuList, Button, useToast } from '@chakra-ui/react'

const UserHeader = () => {
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);

    const toast = useToast()
    toast({
        title: "Copied to clipboard",
        description: "h",
        status: "success",
        duration: 5000,
        isClosable: true
    })
  }
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w="full">
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>Saran</Text>
                <Flex alignItems={"center"} gap={"2"}>
                    <Text fontSize={"sm"}>Saran_2077</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} borderRadius={"full"} padding={1}>threads.net</Text>
                </Flex>
            </Box>
            
            <Box>
                <Avatar 
                    name="Saran"
                    src="/zuck-avatar.png"
                    size={"xl"}
                />
            </Box>

        </Flex>
        <Text>Competitive Programmer, Web Developer</Text>
        <Flex w="full" justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>
                    3.2k Followers
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
                            <MenuItem bg={"gray.dark"} onClick={copyUrl}>Copy Link</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader