import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import Post from '../components/Post.jsx'
import { useParams } from 'react-router-dom'
import useShowToast from "./../hooks/useShowToast.js"

const UserPage = () => {
  const[user, setUser] = useState(null)
  const[posts, setPosts] = useState([])
  const { username } = useParams()
  const showToast = useShowToast()

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/getUserProfile/${username}`)
        const data = await res.json()
        if(data.error) {
          showToast("", data.error, "error")
          return
        }
        setUser(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [username, showToast])

  useEffect(() => {
    const getUserPosts = async () => {
      const res = await fetch(`/api/posts/getUserPost/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if(data.error) {
        return
      }
      setPosts(data.feedPosts)
    }
    getUserPosts()
  }, [username])


  return (
    <>
        {user && <UserHeader user={ user }/>}
        {posts && posts.map((post) => <Post feed={ post } />)}
    </>
  )
}

export default UserPage