import React from 'react'
import { Link } from 'react-router-dom'
import Signup from './../Signup/Signup';
import Login from './../Login/Login';
import Home from './../Home/Home';

export default function Navbar({crrUser, clrUser}) {
  return <>
  <nav class="navbar navbar-expand-lg navbarStyle">
  <div class="container">
    <Link class="navbar-brand" to="/home"><i className="far fa-sticky-note fa-fw"></i>Notes</Link>
    <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <div className="nav-item">
            {crrUser? <li onClick={clrUser}><span class="nav-link">Sign Out</span></li> : <><li><Link class="nav-link" aria-current="page" to="/Login">Login</Link></li>
            <li><Link class="nav-link" to="/Signup">Sign Up</Link></li></> }
          </div>
      </ul>
    </div>
  </div>
</nav>
  </>
}
