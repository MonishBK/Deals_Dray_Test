import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Logout = () => {

    const navigate = useNavigate();

    useEffect( ()=>{

       const LogoutFun = async () =>{
            try{
                const res = await fetch('http://localhost:5000/logout',{
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include"
                });
    
                await res.json();
                // console.log("after response ");
                if(res.status !== 200){ throw new Error(res.error) }
                
                // console.log("from logout page")
                // navigate('/',{replace: true});
                localStorage.removeItem("token")
                setTimeout(() => {
                    navigate('/',{replace: true});
                    window.location.reload(false);
                  }, 1000);
     
    
            } catch (err) {
                // console.log(err);
                // dispatch({type: "USER", payload: false})
                // navigate('/',{replace: true});
                navigate("/");
                localStorage.removeItem("token")
                window.location.reload(false)
            }
        }
        LogoutFun();
    })

    return (
        <>
            <div className="logout_page"></div>
        </>
    )
}

export default Logout

