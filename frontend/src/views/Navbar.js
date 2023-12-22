import React, { useContext } from 'react'
import Myke from "../img/myke.jpg"
import jwt_decode from "jwt-decode"
import { Link } from "react-router-dom"
import AuthContext from '../context/AuthContext'


function Navbar() {



    //TO CHECK IF USER EXISTS AND LOGGED IN
    const {user, logoutUser} = useContext(AuthContext)
    const token = localStorage.getItem("authTokens")   //GET AUTH TOKEN(REFRESH AND ACCESS)

    if (token){
        const decoded = jwt_decode(token) //DECODE WITH JWT TO GET USER INFO
        var user_id = decoded.user_id  //GET THE USER ID FROM THAT INFO
    }



    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark" >
                <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img style={{width:"80px", padding:"20px", borderRadius: "50%"}} src={ Myke } alt=""/>

                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav" >
                        <li class="nav-item">
                            <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>

                        
                        {/*  IF USER IS NOT AUTHENTICATED, DISPLAY THIS AT NAV */}
                        {token === null && 
                        <>
                            <li class="nav-item">
                            <Link class="nav-link" to="/login">Login</Link>
                            </li>
                            <li class="nav-item">
                            <Link class="nav-link" to="/register">Register</Link>
                            </li>
                        </>
                        }


                        {/*  IF USER IS AUTHENTICATED DISPLAY THIS AT NAV */}
                        {token !== null && 
                        <>
                            <li class="nav-item">
                                <Link class="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to="/inbox"> <i className='fas fa-envelope'></i> Inbox</Link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={logoutUser} style={{cursor:"pointer"}}>Logout</a>
                            </li>
                        </>
                        }


                    </ul>
                </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar