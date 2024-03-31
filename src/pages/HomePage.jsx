import { useEffect, useState } from 'react'
import Post from "../components/Post"
import { Flex, Spinner } from '@chakra-ui/react'

const HomePage = () => {
  const[feeds, setFeed] = useState([])
  const[isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getFeed = async() => {
      try{
        const res = await fetch(`/api/posts/feed`)
        const data =await res.json()
        setFeed(data.feedPosts)
        console.log(data)
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setIsLoading(false)
      }
    }
    getFeed()
  }, [])
  return (
    <>
    {
      isLoading ? (
        <Flex alignContent={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <>
        {
          feeds.map((feed) => (
            <Post key={feed._id} feed={feed} />
          ))
        }
      </>
    )
  }
    </>
  )
}

export default HomePage