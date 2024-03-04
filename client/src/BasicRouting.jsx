import { useLayoutEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"

import Login from './Login';
import Dashboard from './Dashboard';
import EmployeeList from './EmployeeList';
import CreateEmployee from './CreateEmployee';
import Logout from "./Logout"
import EditEmployee from './EditEmployee';
import SignUp from './SignUp';
import LoadSpinners from "./LoadSpinners";

const BasicRouting = () => {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      // console.log("auth called")
      setLoading(true)
      const res = await fetch(`http://localhost:5000/datafetch`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
      });

      await res.json();
      // console.log("from the checking component==>",res); 
      
      if (res.status === 200) {
        // setAuthenticate(data)
      }else {
        if(localStorage.getItem("token")){
          localStorage.removeItem("token")
          window.location.reload(false);
        }else{
          localStorage.removeItem("token")
        }
        // throw new Error(res.error); 
      }
    } catch(err) {
      // console.log("routing error=> ",err);
      // history.push('/');
    }
    setLoading(false)
  }

  
  useLayoutEffect(() => {
    if(!localStorage.getItem('token')){
      fetchData()
    }
    // setLoading(false)
    setTimeout(() => {
    }, 1000);

  },[]);

  return (
    <>
      {
        loading ? <LoadSpinners /> :
        localStorage.getItem("token") ? <UserRouting/> : <Routing/>
      }
    </>
  )
}

export default BasicRouting

const UserRouting = () => {
  return (
    <>
        <Routes> 
            {/* <Route path='/' element={<Login />} /> */}
            <Route path='/dash-board' element={<Dashboard />} />
            <Route path='/employee-list' element={<EmployeeList />} />
            <Route path='/employee-list/create-employee' element={<CreateEmployee />} />
            <Route path='/employee-list/edit-employee/:id' element={<EditEmployee />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='*' element={<Navigate to="/dash-board" replace />} />
        </Routes>
    </>
  )
}

const Routing = () => {
  return (
    <>
        <Routes > 
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    </>
  )
}
