import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToast'

const useGetUser = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
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
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [username, showToast])

  return { user, isLoading }
}


export default useGetUser