import React,{useState} from "react";
import "./CSS/login.css"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import LoadSpinners from "./LoadSpinners";

const Login = () => {

  const navigate = useNavigate();
  const [btnStatus, setBtnStatus] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const [userLoginData, setUserLoginData] = useState({
    f_userName: '',
    f_Pwd: '',
});

const inputEvent = (e) => {
    let { name, value } = e.target;
    // console.log(name, value);

    setUserLoginData({ ...userLoginData, [name]: value })

}

const LoginUser = async (e) => {
    e.preventDefault();
    setBtnStatus(true)

    let user_name = document.getElementById("InputUserName");
    let pass = document.getElementById("Inputf_Pwd");
    
    const { f_userName, f_Pwd } = userLoginData;
    // console.log(f_userName, f_Pwd)

    // validation
    if(f_userName === "" &&  f_Pwd === ""){

      toast.error("Please Enter username and password")
      user_name.style.border = "1px solid red";
      pass.style.border = "1px solid red";

    }else if(f_userName === "" || f_Pwd === ""){

      //validate User Name
      if (f_userName === "") {
          toast.error("Please Enter the user Name")
          user_name.style.border = "1px solid red";
        } else {
          user_name.style.border = "1px solid gray";
      }
  
       //validate f_Pwd
       if (f_Pwd === "") {
          toast.error("Please Enter the Password");
          pass.style.border = "1px solid red";
        }else{
        pass.style.border = "1px solid gray";
  
      }

    }else{

      user_name.style.border = "1px solid gray";
      pass.style.border = "1px solid gray";

      const res = await fetch('http://localhost:5000/signin', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
  
            f_userName, f_Pwd
          })
      });
  
      const data = await res.json();
      console.log(data)
  
      if (res.status === 400 || !data || res.status === 404) { 

          toast.error("Invalid Credentials");

      } else {
        localStorage.setItem('token', data.token)
          toast.success("Login Successful!!..");
          pass.style.border = "1px solid gray";
          user_name.style.border = "1px solid gray";
 
          navigate("/dash-board");
          window.location.reload(true)
          // setTimeout(() => {
          // }, 2000);
      }

    }
    setBtnStatus(false)
}

  return (
    <>
      {
        btnStatus ? <LoadSpinners /> : ''
      }
      <div className='row container-fluid login_div m-0'   >
        <div className=" col-sm-12  ">

        <form className='col-sm-6 col-lg-4 py-5 px-4 fs-4  rounded-4 m-auto shadow-lg '>
          <h1 className="mb-3 text-center">
            Login
          </h1>
          <div className="mb-3">
            <label htmlFor="InputUserName" className="form-label"> User Name </label>
            <input type="email" className="form-control fs-5 rounded-2"
            name="f_userName"
            disabled={btnStatus}
            value={userLoginData.f_userName}
            onChange={inputEvent}
             id="InputUserName" aria-describedby="emailHelp"/>
          </div>
          <div className="mb-4 position-relative ">
            <label htmlFor="Inputf_Pwd" className="form-label">Password</label>
            <input type={showPass?"text":"password"} className="form-control fs-5 rounded-2 " 
            name="f_Pwd"
            disabled={btnStatus}
            value={userLoginData.f_Pwd}
            onChange={inputEvent} 
            id="Inputf_Pwd"/>
            <span className="position-absolute  fs-5  text-dark"  onClick={()=> showPass? setShowPass(false): setShowPass(true)}
             style={{
              top:"45%", right:"2%",cursor: "pointer"
            }} > {showPass? <BsFillEyeSlashFill/> : <BsFillEyeFill/>} </span>

            <p className="fs-6  text-end"> <a href="#" className="text-light">forgot Password?</a> </p>
          </div>
          <div className="d-grid">
            <button type="submit" disabled={btnStatus} onClick={LoginUser} className="btn btn-primary rounded-2 fs-5">login</button>
          </div>
          <p className="fs-6 text-center" > New User?  <a className="text-info" href="/signup">Sign up</a> </p>
        </form>

        </div>

          <ToastContainer
                // position="top-center"
                position="bottom-center"
                style={{ fontSize: "1rem" }}
            />

      </div>
    
    </>
  )
}

export default Login