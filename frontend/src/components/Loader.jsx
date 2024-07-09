import React from "react";
import LoadingGif from "../images/loading.gif"
export default function Loader(){
    return(
        
        <div className="loader">
            <div className="loader__image">
                <img src={LoadingGif} alt="" />
            </div>
        </div>
    )
}