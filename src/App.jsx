import { Container } from '@chakra-ui/react'
import React from 'react'
import { Routes, Route } from "react-router-dom"
import PostPage  from "./pages/PostPage"
import UserPage  from "./pages/UserPage"
import Header from './components/Header'

const App = () => {
  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/posts/:pid' element={<PostPage />} />
      </Routes>
    </Container>
  )
}

export default App