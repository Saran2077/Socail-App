import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import Post from '../components/Post.jsx'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import postAtom from '../atom/postAtom.js'
import useGetUser from "./../hooks/useGetUser.js"

const UserPage = () => {
  const[posts, setPosts] = useRecoilState(postAtom)
  const { username } = useParams()
  const { user, isLoading } = useGetUser()

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