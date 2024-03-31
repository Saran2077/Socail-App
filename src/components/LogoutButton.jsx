import { Button } from "@chakra-ui/react";
import { CiLogout } from "react-icons/ci";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atom/authAtom";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";

const LogoutButton = () => {
    const setAuth = useSetRecoilState(authScreenAtom)
    const setUserAtom = useSetRecoilState(userAtom)
    const showToast = useShowToast()

    const handleLogout = async() => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST"
            })
            const data = await res.json()
            if(data.error) {
                showToast("", "Logout Failed", "error")
                return
            }
            localStorage.removeItem("user-info")
            setUserAtom(null)
        }
        catch (error) {
            console.log(error)
        }
    }
    return(
        <>
          <Button 
          position={"fixed"}
          top={"30px"}
          right={"40px"}
          onClick={handleLogout}>
            <CiLogout />
          </Button>
        </>
    )
}

export default LogoutButton