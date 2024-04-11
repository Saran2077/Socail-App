import { useEffect, useState } from 'react'
import Post from "../components/Post"
import { Flex, Spinner } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import postAtom from '../atom/postAtom'

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom)
  const[isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getFeed = async() => {
      try{
        const res = await fetch(`/api/posts/feed`)
        const data =await res.json()
        setPosts(data.feedPosts)
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
          posts.map((post) => (
            <Post key={post._id} feed={post} />
          ))
        }
      </>
    )
  }
    </>
  )
}

export default HomePage