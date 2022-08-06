import React, { useState } from 'react';
import Joi from "joi/dist/joi-browser.min.js";
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Login( {decodeToken} ) {

  let navigate = useNavigate()

  const [loginFlag, setLoginFlag] = useState(false)
  const [messageFaild, setMessageFaild] = useState('')
  const [errorsList, setErrorsList] = useState([])
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  function getUser(e){
    setErrorsList([])
    let inputValue = e.target.value;
    let newUser = {...user};
    newUser[e.target.id] = inputValue;
    setUser(newUser);
  }

  async function submitUser(e) {
    e.preventDefault()
    setLoginFlag(true)

    const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(/^[a-z0-9]{4,20}$/i).required(),
    });
    let joiResponse = schema.validate(user , {abortEarly: false})

    if (joiResponse.error) {
      setErrorsList(joiResponse.error.details)
      setLoginFlag(false)

    }else{

      let {data} = await axios.post(' https://route-egypt-api.herokuapp.com/signin', user)

      if (data.message == 'incorrect password') {
        setMessageFaild(data.message)
      }else{
        localStorage.setItem("token", data.token)
        decodeToken()
        navigate('/home')
        
      }
      setLoginFlag(false)

    }
  }

  function getCurrentError(key) {
    for (const error of errorsList) {
      if (error.context.key === key) {
        return error.message;
      }
    }
    return ''
  }


  return <>
  <div className="vh-100 d-flex jsutify-content-center align-items-center">
  <div className="container">
    
    <form  onSubmit={submitUser} className="col-lg-8 m-auto">
    {messageFaild == 0 ? "" :<div className="alert alert-danger p-2 text-center">{messageFaild}</div>}

     <div className="row g-2">
      <div className="col-12"><input onChange={getUser} type="email" placeholder="Enter Your Email" id="email" className="input-group inputStyle mb-1" /></div> 
      {getCurrentError('email').length == 0? '' : <div className="alert alert-danger p-2 my-1 text-center ">{getCurrentError('email')}</div>}
      <div className="col-12"><input onChange={getUser} type="password" placeholder="Enter Your Password" id="password" className="input-group inputStyle mb-1" /></div>
      {getCurrentError('password').length == 0? '' : <div className="alert alert-danger p-2 my-1 text-center ">{getCurrentError('password')}</div>}
      <div className="col-12"><button className="btnStyle w-100">
      {loginFlag? <i className="fa-solid fa-spinner fa-spin"></i> : 'Sign In'}</button></div>
     </div>
    </form>

  </div>
  </div>
  
  </>
}
