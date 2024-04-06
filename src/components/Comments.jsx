import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { BsThreeDots } from 'react-icons/bs'
import Actions from "./Actions"

const Comments = ({ reply }) => {
  return (
    <>
      <Flex gap={3}>
        <Avatar 
        name={reply?.username}
        src={reply?.userProfilePic}
        />
          <Flex flexDirection={"column"} gap={3} w="full" justifyContent={"space-between"}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>{reply?.username}</Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"xs"} color="gray.light">{ reply?.created }</Text>
                  <BsThreeDots />
                </Flex>
              </Flex>
              <Text>{ reply?.text }</Text>
              <Actions />
          </Flex>
      </Flex>
      <Divider />
  </>
  )
}

export default Comments