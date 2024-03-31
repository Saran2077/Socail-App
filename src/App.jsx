import { Container } from '@chakra-ui/react'
import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import PostPage  from "./pages/PostPage"
import UserPage  from "./pages/UserPage"
import Header from './components/Header'
import AuthPage from './pages/AuthPage'
import { useRecoilValue } from 'recoil'
import userAtom from './atom/userAtom'
import HomePage from './pages/HomePage'
import UpdatePage from './pages/UpdatePage'
import LogoutButton from './components/LogoutButton'
import CreatePost from './components/CreatePost'

const App = () => {
  const user = useRecoilValue(userAtom)
  console.log(user)

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route path="/" element={ user ? <HomePage /> : <Navigate to="/auth" /> } />
        <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path='/update' element={user ? <UpdatePage /> : <Navigate to="/auth" />} />

        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/posts/:pid' element={<PostPage />} />
      </Routes>
      {user && <LogoutButton />}
      {user && <CreatePost />}
    </Container>
  )
}

export default App