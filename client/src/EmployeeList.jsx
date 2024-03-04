import { useState,useEffect, useLayoutEffect } from "react";
import { Navbar } from "./Components/Navbar"
import HeaderName from "./Components/HeaderName"
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "./store/slices/auth";
import { getEmployee } from "./store/slices/EmployeeDataSlice";

import { MdModeEditOutline,MdDelete } from "react-icons/md";

const EmployeeList = () => {

    let [empData, setEmpLisData] = useState("");
    let [empDataList, setEmpLisDataList] = useState("");
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState({
        search:""
    });
    const [sort, setSort] = useState(
        {order:""}
    );

    const userData = useSelector((state) =>{
      return state.userAuth
  })

    const EmployeeData = useSelector((state) =>{
      return state.employeeData
  })

      const deleteEmp = async (_id,f_Name) =>{
        let ans = window.confirm(`Are you sure you want to delete "${f_Name}" details`)

        if (ans){
            try {
                
                const res = await fetch(`http://localhost:5000/delete-employee/${_id}`, {
                    method: "DELETE",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "applictaion/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include",
                  });

                  const data = await res.json();
    
                  console.log(data);
                  console.log(res.status);
                    if (!res.status === 200) {
                        toast.error("Something went wrong!!..");
                        throw new Error(res.error);
                    }

                    if(res.status === 201) {
                      dispatch(getEmployee())
                      toast.success("Deleted Successfully!!..");
                    }
                    // setTimeout(() => {
                    //       // window.location.reload(true)
                    //     }, 2000);


                } catch (error) {
                    // console.log(error)
                }
        }
      }

    const inputEvent = (e) => {
        let { name, value } = e.target;
        // console.log(name, value);
    
        setSearchKey({ ...searchKey, [name]: value })
    }

    const inputSort = (e) => {
        let { name, value } = e.target;
        // console.log(name, value);
    
        setSort({ ...sort, [name]: value })
    }

     const searchByKeyword = (e) =>{
        e.preventDefault();
        // console.log(searchKey.search,)

        if(searchKey.search !== ""){
            
            let newempData = empData?.filter((ele) => {
                // console.log(searchKey.search , ele.f_Name)
                // console.log(ele.f_Name.search(`/${searchKey.search}/`))
    
                if(searchKey.search === ele.f_Name){
                    return ele
                }
    
            })
            setEmpLisDataList(newempData)
        }else{
            
            setEmpLisDataList(empData)
        }


        console.log("sorted data => ",empData)
     }

    const sortFilter = (e) =>{
        e.preventDefault()
        console.log("sorting filter", sort.order)
        if(sort.order === "Date"){
            setEmpLisDataList(empData);
        }else if(sort.order === "a-z"){

            const strAscending = [...empDataList].sort((a, b) =>
            a.f_Name.toLowerCase() > b.f_Name.toLowerCase() ? 1 : -1,
          );
          setEmpLisDataList(strAscending);
          console.log(strAscending);
          // console.log(empDataList);

        }else if(sort.order === "z-a"){
            
            // console.log("a-z sorting inside")
            const strDescending = [...empDataList].sort((a, b) =>
            a.f_Name.toLowerCase() > b.f_Name.toLowerCase() ? -1 : 1,
          );
          setEmpLisDataList(strDescending);
          // console.log(strDescending);
          // console.log(empDataList);

        
        }else if(sort.order === "email-az"){

            const strAscending = [...empDataList].sort((a, b) =>
            a.f_Email.toLowerCase() > b.f_Email.toLowerCase() ? 1 : -1,
          );
          setEmpLisDataList(strAscending);

        }else if(sort.order === "email-za"){
            
            const strDescending = [...empDataList].sort((a, b) =>
            a.f_Email.toLowerCase() > b.f_Email.toLowerCase() ? -1 : 1,
          );
          setEmpLisDataList(strDescending);

        
        }
    }

      useLayoutEffect(()=>{
        // FetchData()
        if(userData?.user?.length === 0 ){
          dispatch(getUser())
          dispatch(getEmployee())
        }
        // ReloadData()
        // console.log(empData)
      },[userData,dispatch]) 
      
      useEffect(() => {
        setEmpLisDataList(EmployeeData?.data)
        setEmpLisData(EmployeeData?.data)
        // console.log(EmployeeData?.data)
      },[EmployeeData?.data]);
      

      useEffect(()=>{
      },[searchKey.search])


  return (
    <>
        <Navbar user={userData?.user} />
        <HeaderName name="Employee List"/>

        <div className="container">
            <div className="col-sm-12 col-lg-6 d-flex ms-auto justify-content-end align-items-center">
                <div className="me-5 fw-bolder" >Total Count : {empData?.length} </div>
                <Link className="btn btn-outline-success" to="/employee-list/create-employee"  >Create Employee</Link>
            </div>
        </div> 

        <div className=" container d-flex align-content-end py-2 ">
                <div className="col-12 d-flex justify-content-end ">
                    <form className="d-flex col-11 ">
                        {/* <button className="btn btn-outline-primary" onClick={searchByKeyword}>Search</button> */}
                        <input className="form-control me-4" 
                        name="search"
                        value={searchKey.search}
                        onChange={inputEvent}
                        onClick={(e) => searchKey.search === "" ? searchByKeyword(e):""}
                        type="search" placeholder="Enter Search Keyword" aria-label="Search"/>

                        <div className="d-flex me-3 col-3">
                            <div className="d-flex align-items-center col-5">Sort By : </div>
                            <select className="form-select" id="InputSelect"
                            name="order"
                            value={sort.order}
                            onChange={inputSort}
                            type="search"
                            aria-label="Default select example">
                                <option value="Date" > Date</option>
                                <option value="a-z">A-Z</option>
                                <option value="z-a">Z-A</option>
                                <option value="email-az">email A-Z</option>
                                <option value="email-za">email Z-A</option>
                            </select>
                        </div>
                        <button className="btn btn-outline-primary" onClick={(e) => sortFilter(e)} >
                            sort
                        </button>

                    </form>
                </div>
        </div>

        {/* tables View */}
        <table className="table container table-striped table-hover">
            <thead>
                <tr>
                <th scope="col">Unique Id</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile No</th>
                <th scope="col">Designation</th>
                <th scope="col">Gender</th>
                <th scope="col">Course</th>
                <th scope="col">Create Date</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    empDataList?.length > 0 ?
                    empDataList?.filter((ele) =>{
                      if(searchKey.search.length === 0){
                        return ele
                      }else{
                        return ele.f_Name.toLowerCase().includes(searchKey.search.toLowerCase())
                      }
                    })
                    .map((ele,index)=>{
                        const {_id,f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image,cretedOn} = ele

                        return(
                            <tr key={_id}>
                            <th scope="row">{index+1}</th>
                                <td>
                                    <img src={f_Image} alt="propic" width={50} height={50} />
                                </td>
                                <td>{f_Name}</td>
                                <td> <a href="mailto:monishbk@gmail.com">{f_Email} </a> </td>
                                <td>{f_Mobile}</td>
                                <td>{f_Designation}</td>
                                <td>{f_Gender}</td>
                                <td>{f_Course.join()}</td>
                                <td>{cretedOn}</td>
                                <td >
                                    <Link className="me-3 text-dark " to={`/employee-list/edit-employee/${_id}`} style={{cursor:"pointer",textDecoration:"none"}} > <MdModeEditOutline/> </Link> 
                                    <span className="" onClick={()=> deleteEmp(_id,f_Name)} style={{cursor:"pointer"}} ><MdDelete /></span>
                                </td>
                            </tr>
                        )

                    })
                    : 
                    ""
                  }
            </tbody>
            </table>
            {
              empDataList?.length > 0 ? "" :
              <div className="d-flex justify-content-center py-5 container" >No employee data</div> 
            }
            <ToastContainer
                // position="top-center"
                position="bottom-center"
                style={{ fontSize: "1rem" }}
            />

    </>
  )
}

export default EmployeeList