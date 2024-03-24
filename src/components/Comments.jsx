import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { BsThreeDots } from 'react-icons/bs'
import Actions from "./Actions"

const Comments = ({ userAvatar, username, comment, created, likes}) => {
  return (
    <>
      <Flex gap={3}>
        <Avatar 
        name={username}
        src={userAvatar}
        />
          <Flex flexDirection={"column"} gap={3} w="full" justifyContent={"space-between"}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>Saran2077</Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"xs"} color="gray.light">{ created }</Text>
                  <BsThreeDots />
                </Flex>
              </Flex>
              <Text>{ comment }</Text>
              <Actions />
          </Flex>
      </Flex>
      <Divider />
  </>
  )
}

export default Comments