import SignUpCard from "../components/SignUpCard"
import LoginCard from "../components/LoginCard"
import authScreenAtom from "../atom/authAtom"
import { useRecoilValue } from "recoil"

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  return (
    <>
    {authScreenState === "login" ? <LoginCard /> : <SignUpCard />}
    </>
  )
}

export default AuthPage