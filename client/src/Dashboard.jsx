import { useEffect } from "react";
import { Navbar } from "./Components/Navbar"
import HeaderName from "./Components/HeaderName"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "./store/slices/auth";
import { getEmployee } from "./store/slices/EmployeeDataSlice";

const Dashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  const userData = useSelector((state) =>{
    return state.userAuth
})

  const FetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/datafetch", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "applictaion/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
      });

      const data = await res.json();

      // console.log(data)

      if (!res.status === 200) {
        navigate("/");
        window.location.reload(false)
      }
    } catch (err) {
      // console.log(err);
      navigate("/");
      window.location.reload(false)
    }
  };

  // console.log(userData?.user)

  useEffect(() => {
    FetchData()
    dispatch(getUser())
    dispatch(getEmployee())
  },[]);

  return (
    <>
    {
      userData?.user?._id &&
      <>
        <Navbar user={userData?.user} />
        <HeaderName name="Dashboard" />
        <h1 className="text-center py-5">Welcome To Admin Panel</h1>
      </>
    }
    </>
  )
}

export default Dashboard