import React from "react"
import { Link } from "react-router-dom"

export default function Footer(){
    return(
        <footer>
            <ul className="footer__categories">
                <li><Link to="/posts/category/International">International</Link></li>
                <li><Link to="/posts/category/Entertainment">Entertainment</Link></li>
                <li><Link to="/posts/category/Politics">Politics</Link></li>
                <li><Link to="/posts/category/Health">Health</Link></li>
                <li><Link to="/posts/category/Science">Science</Link></li>
                <li><Link to="/posts/category/Environment">Environment</Link></li>
                <li><Link to="/posts/category/Sports">Sports</Link></li>
                <li><Link to="/posts/category/LifeStyle">LifeStyle</Link></li>
                <li><Link to="/posts/category/Technology">Technology</Link></li>
            </ul>ies
            <div className="footer__copyright">
                <small>All Rights Reserved &copy; Copyright, News Aggregator.</small>
            </div>
        </footer>
    )
}