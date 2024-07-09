import React from "react"
import {useContext} from "react"
import Post from "../components/Posts"
import Login from "../pages/Login"
import { UserContext } from "../context/userContext";

export default function Home (){
    const{currentUser} = useContext(UserContext)
    
    return(
        <div>
          {currentUser?.id && <Post></Post>}
          {!currentUser?.id && <Login></Login>}
        </div>
    )
}
