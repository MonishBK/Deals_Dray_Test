import React,{useState} from "react";
import "./CSS/login.css"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import LoadSpinners from "./LoadSpinners";

const SignUp = () => {

  const navigate = useNavigate();

  const [btnStatus, setBtnStatus] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassC, setShowPassC] = useState(false);

  const [userLoginData, setUserLoginData] = useState({
    f_userName: '',
    f_Pwd: '',
    f_CPwd: '',
});

const inputEvent = (e) => {
    let { name, value } = e.target;
    // console.log(name, value);

    setUserLoginData({ ...userLoginData, [name]: value })

}

const SignUpUser = async (e) => {
    e.preventDefault();
    setBtnStatus(true)

    let user_name = document.getElementById("InputUserName");
    let pass = document.getElementById("Inputf_Pwd");
    let pass_c = document.getElementById("Inputf_Pwd_c");
    
    const { f_userName, f_Pwd, f_CPwd } = userLoginData;
    // console.log(f_userName, f_Pwd, f_CPwd)

    // validation
    if(f_userName === "" &&  f_Pwd === "" && f_CPwd === ""){

      toast.error("Please Enter username and password")
      user_name.style.border = "1px solid red";
      pass.style.border = "1px solid red";
      pass_c.style.border = "1px solid red";

    }else if(f_userName === "" || f_Pwd === "" || f_CPwd === "" || f_Pwd.length <= 6 || f_CPwd <= 6 ){

      //validate User Name
      if (f_userName === "") {
          toast.error("Please Enter the user Name")
          user_name.style.border = "1px solid red";
        } else {
          user_name.style.border = "1px solid gray";
      }

          
          //validate f_Pwd
          if (f_Pwd === "" || f_Pwd.length <=6){
             toast.error("Please Enter the Password (min 6 characters)");
             pass.style.border = "1px solid red";
           }else{
           pass.style.border = "1px solid gray";
     
         }
    
          //validate f_CPwd
          if (f_CPwd === "" || f_CPwd.length <= 6) {
            toast.error("Please Enter the Password (min 6 characters)");
             pass_c.style.border = "1px solid red";
           }else{
           pass_c.style.border = "1px solid gray";
     
         }
  

    }else{

      user_name.style.border = "1px solid gray";
      pass.style.border = "1px solid gray";
      pass_c.style.border = "1px solid gray";

      const res = await fetch('http://localhost:5000/register', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
  
            f_userName, f_Pwd, f_CPwd
          })
      });
  
      // const data = await res.json();
  
      if (res.status === 400 || res.status === 404) { 

          toast.error("Invalid Credentials");

      }else if(res.status === 422){
        toast.error("user already exist!!..");
      } else if(res.status === 401){
        toast.error("Password not matching!!..");
        pass.style.border = "1px solid red";
        pass_c.style.border = "1px solid red";
      } 
      
      else {
          toast.success("Registered Successfull!!..");
          pass.style.border = "1px solid gray";
          pass_c.style.border = "1px solid gray";
          user_name.style.border = "1px solid gray";
 
          setTimeout(() => {
            setBtnStatus(false)
            navigate("/");
            window.location.reload(true)
          }, 2000);
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
            Sign Up
          </h1>
          <div className="mb-3">
            <label htmlFor="InputUserName" className="form-label"> User Name </label>
            <input type="email" className="form-control fs-5 rounded-2"
            name="f_userName"
            value={userLoginData.f_userName}
            onChange={inputEvent}
             id="InputUserName" aria-describedby="emailHelp"/>
          </div>
          <div className="mb-4 position-relative ">
            <label htmlFor="Inputf_Pwd" className="form-label">Password</label>
            <input type={showPass?"text":"password"} className="form-control fs-5 rounded-2 " 
            name="f_Pwd"
            value={userLoginData.f_Pwd}
            onChange={inputEvent} 
            id="Inputf_Pwd"/>
            <span className="position-absolute  fs-5  text-dark"  onClick={()=> showPass? setShowPass(false): setShowPass(true)}
             style={{
              top:"55%", right:"2%",cursor: "pointer"
            }} > {showPass? <BsFillEyeSlashFill/> : <BsFillEyeFill/>} </span>

          </div>
          <div className="mb-4 position-relative ">
            <label htmlFor="Inputf_Pwd_c" className="form-label">Confirm Password</label>
            <input type={showPassC?"text":"password"} className="form-control fs-5 rounded-2 " 
            name="f_CPwd"
            value={userLoginData.f_CPwd}
            onChange={inputEvent} 
            id="Inputf_Pwd_c"/>
            <span className="position-absolute  fs-5  text-dark"  onClick={()=> showPassC? setShowPassC(false): setShowPassC(true)}
             style={{
              top:"55%", right:"2%",cursor: "pointer"
            }} > {showPassC? <BsFillEyeSlashFill/> : <BsFillEyeFill/>} </span>
          </div>

          <div className="d-grid">
            <button type="submit" disabled={btnStatus} onClick={SignUpUser} className="btn btn-success rounded-2 fs-5">Sign Up</button>
          </div>
          <p className="fs-6 text-center" > Already have an account?  <a className="text-info" href="/">Login</a> </p>
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

export default SignUp