import './App.css';
import Home from './Components/Home/Home';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import jwtDecode from "jwt-decode"
import React, { useEffect, useState } from 'react';


function App() {


  function TestingRoute(props) {
    
    if (localStorage.getItem("token") == null) {
        return <Navigate to="/login" />
    }else{
      return props.children
    }

  }

  const [currentUser, setCurrentUser] = useState(null)
  let navigate = useNavigate()

  function decodeToken() {
    let userTkn = jwtDecode(localStorage.getItem("token"))
    setCurrentUser(userTkn)
  }

  function clearUserToken() {
    localStorage.removeItem("token")
    setCurrentUser(null)
    navigate('/login')
  }

  useEffect(() => {
    
  if (localStorage.getItem("token") != null) {
    decodeToken()
  }
    
  }, [])
  

  return <>

  <Navbar crrUser={currentUser} clrUser={clearUserToken} />
  <Routes>
  <Route path="/" element={ <TestingRoute> <Home /> </TestingRoute>}/>
  <Route path="home" element={ <TestingRoute> <Home /></TestingRoute> }/>
  <Route path="signup" element={<Signup />}/>
  <Route path="login" element={<Login decodeToken={decodeToken} />}/>
  <Route path="*" element={<>
  <div className="mainColor vh-100 d-flex justify-content-center align-items-center fs-1">4 0 4</div></>}/>
  </Routes>

  </>

}

export default App;
