import React,{useContext,useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import Login from "./Login"

export default function Logout (){
    const {setCurrentUser} = useContext(UserContext)
    const navigate = useNavigate();
    const{currentUser} = useContext(UserContext)

    setCurrentUser(null)
    navigate('/login')
    return(
        <div>
          {!currentUser?.id && <Login></Login>}
        </div>

    )
}