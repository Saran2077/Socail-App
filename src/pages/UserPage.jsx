import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <>
        <UserHeader />
        <UserPost 
          postImage={'/post1.png'}
          postTitle={"This is my first post"}
          likes={400}
          replies={1}
        />
        <UserPost 
          postImage={'/post2.png'}
          postTitle={"This is my second post"}
          likes={50}
          replies={10}
        />
        <UserPost 
          postImage={'/post3.png'}
          postTitle={"Elon Musk"}
          likes={1500}
          replies={108}
        />
        <UserPost 
          postTitle={"This is my second post"}
          likes={450}
          replies={95}
        />
    </>
  )
}

export default UserPage