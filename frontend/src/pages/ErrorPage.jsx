import React from "react"
import { Link } from "react-router-dom"

export default function ErrorPage (){
    return(
        <section className="error-page">
            <div className="center">
                <Link to="/" className="btn primary">Click Here To Go Back Home</Link>
                <h2>Page Not Found</h2>
            </div>
        </section>
    )
}