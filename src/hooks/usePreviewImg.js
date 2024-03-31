import React, { useState } from 'react'
import useShowToast from './useShowToast'

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState("")
  const showToast = useShowToast()

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.type.startsWith("image")) {
        const reader = new FileReader()
        
        reader.onloadend = () => {
            setImgUrl(reader.result)
        }

        reader.readAsDataURL(file)
    }
    else {
        showToast("", "Only images are supported", "error")
    }
  }

  return { imgUrl, handleImageChange, setImgUrl }
}

export default usePreviewImg