import { useState,useEffect } from "react";
import { Navbar } from "./Components/Navbar"
import HeaderName from "./Components/HeaderName"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from 'react-router-dom';
import { getUser } from "./store/slices/auth";
import { getEmployee } from "./store/slices/EmployeeDataSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadSpinners from "./LoadSpinners";

const EditEmployee = () => {

    const {id} = useParams();
    // console.log(id)

  const [btnStatus, setBtnStatus] = useState(false);
  const dispatch = useDispatch()

    const navigate = useNavigate();
    const userData = useSelector((state) =>{
      return state.userAuth
  })

    const EmployeeData = useSelector((state) =>{
      return state.employeeData
  })

    let [employeeData, setEmployeeData] = useState({});

    const [Imgload, setImgload] = useState("");

    let [courseinfo, setCourseInfo] = useState({
        courses: [],
      });
    
    const inputEvent = (e) => {
        let { name, value } = e.target;
        // console.log(name, value);
    
        setEmployeeData({ ...employeeData, [name]: value })
    
    }

    const handleChange =  (e) => {
        
        // Destructuring
        const { value, checked } = e.target;
        const { courses } = courseinfo;
          
        // console.log(`${value} is ${checked}`);
         
        if (checked) {
            setCourseInfo({
            courses: [...courses, value],
          });
        }
      
        else {
            setCourseInfo({
            courses: courses.filter((e) => e !== value),
          });
        }

    }

    const handelFileUpload = async (e) =>{
        const file = e.target.files[0];
        // console.log(file)
        let base64
        if(file !== undefined){
            base64 = await convertToBase64(file)
            employeeData.f_Image = base64;
            setImgload(base64);
        }else{
            setImgload("")
        }
        // console.log(base64)
    }

    const PostData = async (e) =>{
        e.preventDefault();
        setBtnStatus(true)
        
        let { f_Name, f_Email, f_Mobile, f_Designation, f_Gender }= employeeData

        let uname = document.getElementById("InputName");
        let email = document.getElementById("InputEmail");
        let phone = document.getElementById("InputNumber");
        let designation = document.getElementById("InputSelect");
        let course_ID = document.getElementById("course_id");
        let gender_ID = document.getElementById("gender_id");
        let file = document.getElementById("InputFile");

        //more email validate
        const isEmail = (emailVal) => {
            let atSynmol = emailVal.indexOf("@");
            if (atSynmol < 1) return false;
            let dot = emailVal.lastIndexOf(".");
            if (dot <= atSynmol + 2) return false;
            if (dot === emailVal.length - 1) return false;
            return true
        }

            // function to show errors
            const showMsg = (curr_div, msg) =>{
                curr_div.setAttribute(
                    "style",
                    `border:1px solid red; box-shadow: 1px 1px 2px 1px rgba(16,128,234,.1);`
                );
                toast.error(msg);
            }
        
            // function to hide errors
            const hideMsg = (curr_div) =>{
            curr_div.setAttribute(
                "style",
                `border: 1px solid gray; box-shadow: 1px 1px 2px 1px rgba(16,128,234,.1);`
                );
        }

        // validation
    if(!f_Name  &&  !f_Email &&  !f_Mobile && !f_Designation  && !f_Gender && courseinfo.courses.length === 0 && !Imgload){
        uname.style.border = "1px solid red";
        email.style.border = "1px solid red";
        phone.style.border = "1px solid red"; 
        designation.style.border = "1px solid red";
        course_ID.style.border = "1px solid red";
        gender_ID.style.border = "1px solid red";
        file.style.border = "1px solid red";
        toast.error("Pleases fill all fields");

    }else if(!f_Name  ||  !f_Email ||  !f_Mobile || !f_Designation  || !f_Gender || courseinfo.courses.length === 0 || !Imgload){

            //validate username
        if (f_Name === "") {
            showMsg(uname, " Name can not be blank")
        } else if (f_Name.length <= 2) {
            showMsg(uname, "username min 3 char")
        } else {
            hideMsg(uname)
        }

         //validate email
         if (f_Email === "") {
            showMsg(email, "email can not be blank")
          } else if (!isEmail(f_Email)) {
            showMsg(email, "not a valid Email")
          } else {
            hideMsg(email);
          }
    
          //validate Phone
          if (f_Mobile === "") {
            showMsg(phone, "phone can not be blank")
          } else if (String(f_Mobile).length !== 10) {
            showMsg(phone, "not a valid phone number")
          }else if(isNaN (f_Mobile)){
            showMsg(phone, "not a valid phone number")
          } else {
            hideMsg(phone);
          }
    
          //validate Designation
          if (f_Designation === "") {
            showMsg(designation, "Designation can not be blank")
          }  else {
            hideMsg(designation);
          }
    
          //validate Gender
          if (f_Gender === "") {
            showMsg(gender_ID, "Pleases Select the Gender")
          }  else {
            gender_ID.style.border = "none ";
          }

          //validate Gender
          if (courseinfo.courses.length === 0 ) {
            showMsg(course_ID, "Please Select the Course")
          }  else {
            course_ID.style.border = "none";
          }

          //validate Gender
          if (Imgload === "" ) {
            showMsg(file, "Please Select the Image")
          }  else {
            hideMsg(file);
          }
    

    }else{
        hideMsg(uname)
        hideMsg(email);
        hideMsg(phone);
        hideMsg(designation);
        gender_ID.style.border = "none ";
        course_ID.style.border = "none";
        hideMsg(file);

        // console.log("final check=>",f_Name, f_Email, f_Mobile, f_Designation, f_Gender, courseinfo.courses, Imgload)

        const res = await fetch(`http://localhost:5000/edit-employee-data/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
    
                f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course : courseinfo.courses, f_Image:Imgload
            })
        });

        const data = await res.json();
        console.log(data.error)
  
        if (res.status === 400 || !data || res.status === 404) { 
            // console.log("Something went Wrong");
            toast.error("Invalid Credentials");
  
          }else if(data?.error !== undefined && data?.error?.keyPattern?.f_Mobile){
            showMsg(phone, "phone number already taken")

          }else if(data?.error !== undefined && data?.error?.keyPattern?.f_Email){
              
              showMsg(email, "email already taken")
        }else if(res.status === 510){
          showMsg(email, "Invalid email")
      }
        
        else {
            toast.success("Updated Successfully!!..");
            hideMsg(email);
            hideMsg(phone);
            // console.log("Inserted Successfully!!..");
            dispatch(getEmployee())
            setBtnStatus(false)
            navigate("/employee-list");
            setEmployeeData({})
            setImgload("")
            setCourseInfo({course:[]})
            
        }

        

    }
    setBtnStatus(false)
    }

    useEffect(() => {
        
    }, [employeeData.f_Image]);

    useEffect(() => {
        // FetchData()
        dispatch(getUser())
        dispatch(getEmployee())
        // FetchEmp()
        // console.log(courseinfo.courses)
    }, []);
          
    useEffect(() => {
      // console.log(EmployeeData?.data)
      
      let res = EmployeeData?.data?.filter((item) => {
        return item._id === id ;
      }); 
      // console.log(res[0])
      setEmployeeData(res[0])
      setImgload(res[0].f_Image)
        setCourseInfo({courses:res[0].f_Course})
    },[EmployeeData?.data]);



  return (
    <>
    {
      btnStatus ? <LoadSpinners /> : ''
    }
        <Navbar user={userData?.user} />
        <HeaderName name="Edit Employee" />

        <div className="row py-3 " style={{backgroundColor:"#f1f2f5"}} >
            <div className="col-sm-9 shadow fs-5 mx-auto overflow-auto from_scroll rounded-4 " 
             style={{maxWidth:"1000px", maxHeight: "550px", backgroundColor: "#fff" }} >
                <form className=" px-4  py-5 "  >
                    <div className="mb-3">
                        <label htmlFor="InputName" className="form-label">Name:</label>
                        <input type="text" className="form-control"
                        name="f_Name"
                        value={employeeData.f_Name}
                        onChange={inputEvent}
                         id="InputName" placeholder="Employee Name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="InputEmail" className="form-label">Email </label>
                        <input type="email" className="form-control" placeholder="Email Address" 
                         name="f_Email"
                         value={employeeData.f_Email}
                         onChange={inputEvent}
                        id="InputEmail" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="InputNumber" className="form-label">Mobile No</label>
                        <input type="text" className="form-control" placeholder="Phone No" 
                         name="f_Mobile"
                         value={employeeData.f_Mobile}
                         onChange={inputEvent}
                        id="InputNumber"/>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="InputSelect" className="form-label">Designation</label>
                        <select className="form-select" id="InputSelect"
                        name="f_Designation"
                        value={employeeData.f_Designation}
                        onChange={inputEvent}
                        aria-label="Default select example">
                            <option > </option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    <div className="mb-3" id="gender_id" >
                    <label className="form-label">Course</label> <br/>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" 
                        checked={employeeData.f_Gender === "Male"? true: false}
                        name="f_Gender" 
                        value="Male"
                        onChange={inputEvent}
                        id="radio-Male"/>
                        <label className="form-check-label" htmlFor="radio-Male">
                            Male
                        </label>
                        </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" 
                        checked={employeeData.f_Gender === "Female"? true: false}
                        name="f_Gender" 
                        value="Female"
                        onChange={inputEvent}
                        id="radio-Female" />
                        <label className="form-check-label" htmlFor="radio-Female">
                            Female
                        </label>
                        </div>
                    </div>

                    <div className="mb-3 " id="course_id" >
                    <label className="form-label">Course</label> <br/>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" 
                            checked={courseinfo.courses.includes("MCA")? true: false}
                            name="courses"
                            value="MCA"
                            onChange={handleChange}
                            id="Checkbox-MCA" />
                            <label className="form-check-label" htmlFor="Checkbox-MCA">MCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" 
                            checked={courseinfo.courses.includes("BCA")? true: false}
                            name="courses"
                            value="BCA"
                            onChange={handleChange}
                            id="Checkbox-BCA"/>
                            <label className="form-check-label" htmlFor="Checkbox-BCA" >BCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" 
                            checked={courseinfo.courses.includes("BSc")? true: false}
                            name="courses"
                            value="BSc"
                            onChange={handleChange}
                            id="Checkbox-BSc" />
                            <label className="form-check-label" htmlFor="Checkbox-BSc">BSc </label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="InputFile" className="form-label">Image Upload</label> <br />
                        {
                            Imgload? <img src={Imgload} alt="picture"  width={90} height={70}/>: ""
                        }
                        
                        <input type="file" className="form-control" 
                         name="f_Image"
                        //  value={employeeData.f_Image}
                         onChange={(e)=>handelFileUpload(e)}
                        id="InputFile" accept="image/png, image/jpg, image/jpeg, image/JPG, image/JPEG" />
                    </div>
                    <div className="d-grid">
                        <button type="submit" disabled={btnStatus} onClick={PostData} className="btn btn-success fs-5 ">Submit</button>
                    </div>
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

export default  EditEmployee



const convertToBase64 = (file) =>{
    return new Promise((resolve, reject) =>{
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>{
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) =>{
            reject(error)
        }
    })
}