import React, { useState } from 'react';
import Joi from "joi/dist/joi-browser.min.js";
import axios from 'axios';
import { useNavigate } from 'react-router';


export default function Signup() {

  let navigate = useNavigate()

  const [flagSign, setflagSign] = useState(false)
  const [messageFaild, setMessageFaild] = useState('')
  const [errorsList, setErrorsList] = useState([])
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    age: 0
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
    setflagSign(true)

    const schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(10).required(),
    last_name: Joi.string().alphanum().min(3).max(10).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(/^[a-z0-9]{4,20}$/i).required(),
    age: Joi.number().min(10).max(60).required()
    });
    let joiResponse = schema.validate(user , {abortEarly: false})

    if (joiResponse.error) {
      setErrorsList(joiResponse.error.details)
      setflagSign(false)
    }else{

      let {data} = await axios.post(' https://route-egypt-api.herokuapp.com/signup', user)

      if (data.errors) {
        setMessageFaild(data.message)
      }else{
        navigate('/login')
      }
      setflagSign(false)
     
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
    {messageFaild == 0 ? "" :<div className="alert alert-danger p-2 text-center">{messageFaild}</div>}
    <form  onSubmit={submitUser} className="col-lg-8 m-auto">
     <div className="row g-2">
       <div className="col-md-6"><input onChange={getUser} type="text" placeholder="Enter First Name" id="first_name" className="input-group inputStyle mb-1" />
       {getCurrentError('first_name').length == 0? '' : <div className="alert alert-danger p-2 text-center ">{getCurrentError('first_name')}</div>}
       </div>
       <div className="col-md-6"><input onChange={getUser} type="text" placeholder="Enter Last Name" id="last_name" className="input-group inputStyle mb-1" />
       {getCurrentError('last_name').length == 0? '' : <div className="alert alert-danger p-2 text-center ">{getCurrentError('last_name')}</div>}
       </div>
      <div className="col-12"><input onChange={getUser} type="email" placeholder="Enter Your Email" id="email" className="input-group inputStyle mb-1" />
      {getCurrentError('email').length == 0? '' : <div className="alert alert-danger p-2 text-center ">{getCurrentError('email')}</div>}
      </div> 
      <div className="col-12"><input onChange={getUser} type="password" placeholder="Enter Your Password" id="password" className="input-group inputStyle mb-1" />
      {getCurrentError('password').length == 0? '' : <div className="alert alert-danger p-2 text-center ">{getCurrentError('password')}</div>}
      </div>
      <div className="col-12"><input onChange={getUser} type="number" placeholder="Enter Your Age" id="age" className="input-group inputStyle mb-1" />
      {getCurrentError('age').length == 0? '' : <div className="alert alert-danger p-2 text-center ">{getCurrentError('age')}</div>}
      </div>
      <div className="col-12"><button className="btnStyle w-100">
        {flagSign? <i className="fa-solid fa-spinner fa-spin"></i> : 'Sign Up'}</button></div>
     </div>
    </form>

  </div>
  </div>

  </>
}
