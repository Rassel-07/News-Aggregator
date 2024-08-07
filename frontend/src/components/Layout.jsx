import React from "react"
import {Outlet} from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import {useContext} from "react"
import { UserContext } from "../context/userContext";

export default function Layout(){
    const{currentUser} = useContext(UserContext)
    return(
        <div>

            <Header/>
                <Outlet/>
          {currentUser?.id && <Footer/>}
        </div>
    )
}