const express = require('express');
const app = express();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Authenticate = require("./middleware/authenticate"); 
const cookieParser = require("cookie-parser");
var validator = require('validator');
const cors = require('cors');

dotenv.config({path:"./config.env"}); 
const PORT = process.env.PORT;

app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

// Database Schema
const User = require("./model/UserSchema");
const Employee = require("./model/EmployeeSchema");

require('./db/conn');

const corsOptions = {
    origin: "http://localhost:5173",
    // origin: "https://www.friendsledger.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true
};

app.use(cors(corsOptions)); 

app.use(cookieParser())
 
// to read json file we use this middle ware
app.use(express.json());


app.get('/', (req, res) =>{
    res.send("Hello world from the server");
});

// user Registration 
app.post('/register', async (req, res) =>{

    const {f_userName,f_Pwd,f_CPwd} = req.body;

    if(!f_userName || !f_Pwd || !f_CPwd ){
        // console.log(f_userName , f_Pwd , f_CPwd)
        return res.status(422).json({error : "Plz fill all the field"});
    }
    
    try{

        const userExist = await User.findOne({f_userName : f_userName});

        if( userExist ){
            // console.log("Email already exist")
            return res.status(422).json({error : "User already exist"});
        }else if(f_Pwd !== f_CPwd){
            // console.log("Password are not matching")
            return res.status(401).json({error : "Password are not matching"});
        }else {
            // console.log("inside the else loop")
            const user = new User({f_userName,f_Pwd});
            await user.save();
            res.status(201).json({ message: "successfully" });
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ error : "Something went wrong!!.."}); 
    }
});


// user login 
app.post("/signin", async (req, res) =>{

    try{

        let token; 
        const { f_userName, f_Pwd } = req.body;

        if(f_userName !== undefined){
        //    console.log( "checking=> ",f_userName, f_Pwd)

            if(f_userName || f_Pwd){
                var userLogin = await User.findOne( { f_userName: f_userName } );
            }

        }else{
            // console.log("in else statement")
            // console.log( "checking=> ",f_userName, f_Pwd)
            return res.status(400).json({error : "invalid login details moni"});
        } 

        if(userLogin){
            const isMatch = await bcrypt.compare(f_Pwd, userLogin.f_Pwd);

            token = await userLogin.generateAuthTocken();
            // console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            // console.log("matching", isMatch)
            if(!isMatch){
                // console.log("inside is Match")
                res.status(400).json({ error : "Invalid Credential"});
            } else {
                res.json({ message : "user Signin successful!..", token});
            }
        }else{
            // console.log("didn't get the user")
            res.status(400).json({ error : "Invalid Credential"}); 
        }


    } catch (err) {
        console.log(err);
    }

});


// user Logout
app.get("/logout", Authenticate , async (req, res) =>{
    try {
        // console.log(req.user.f_userName);
        // console.log(req.user.tokens.length +" " + "before logout");

        const userName = req.user.f_userName
        // for single logout in database
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !==  req.token;
        })
        await req.user.save();
        

        res.clearCookie("jwtoken", {path:'/'});
        // console.log(" logout Successfull!..");
        // console.log(req.user.tokens.length + " " + "after logout");

        res.status(200).send("User Logout");
    } catch (error) {
        res.status(500).sendStatus(error);

    }
});


//user datafetching
app.get('/datafetch', Authenticate , (req,res) =>{
    res.send(req.rootUser);
});


// add Employee
app.post("/add-employee", async (req,res)=>{
    // console.log("inside add employee");

    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image}= req.body;
    // console.log(f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image );

    if(!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course ||  !f_Image){
        return res.status(422).json({error : "Plz filled all the field"});
    }

    try{
        if(!validator.isEmail(f_Email)) return res.status(510).json({ message: "Invalid email!!.." });

        var emailExist = await Employee.find( { f_Email: f_Email } );
        var phoneExist = await Employee.find( { f_Mobile: f_Mobile } );

        // console.log("email length=>",emailExist.length)
        // console.log("phone length=>",phoneExist.length)
        if(emailExist.length > 0) {
            // console.log("check email => ",emailExist);
            return res.status(409).json({error : "Email"});
        }
        if(phoneExist.length > 0) {
            // console.log("check phone => ",phoneExist);
            return res.status(409).json({error : "Phone"});
        }

            const employee_data = new Employee({f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image})
            await employee_data.save();
            res.status(201).json({ message: "Inserted successfully!!" });
            

    }catch(err){
        console.log("Error -->",err);
        res.status(422).json({ error: err });
    }

})


// Update Employee
app.put("/edit-employee-data/:id", async (req,res)=>{
    // console.log("inside edit employee");

    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image}= req.body;
    // console.log(f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image );

    if(!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course ||  !f_Image){
        return res.status(422).json({error : "Plz filled all the field"});
    }

    try{

        const _id = req.params.id;
        // console.log(_id)

        if(!validator.isEmail(f_Email)) return res.status(510).json({ message: "Invalid email!!.." });

        const empUpdate = await Employee.findByIdAndUpdate( _id,{f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image},{
            new : true
        });

        res.status(201).json({ message: "Employee Details Updated Successfully!!.." });
        // console.log("Employee Details Updated Successfully!!..")

    }catch(err){
        console.log("Error -->",err);
        res.status(422).json({ error: err });
    }

})


// Employee List
app.get("/employee-list-data", async(req,res)=>{

    try{

            const emp_list = await Employee.find(); 
            // console.log(emp_list)
            res.status(200).send(emp_list)

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: err });
    }




})

// Employee By ID
app.get("/employee-data/:id", async(req,res)=>{

    try{
        const _id = req.params.id;
        // console.log(_id)
        const emp_data = await Employee.findById(_id); 
         // console.log(emp_list)
        res.status(200).send(emp_data)

    } catch (err) {
        console.log(err);
        res.status(422).json({ error: err });
    }




})


// Delete Employee
app.delete("/delete-employee/:id", async (req,res) =>{

    try{

        const _id = req.params.id;
        // console.log(_id)

        if(!_id){
            // console.log("Error in finding the employee");
            res.status(422).json({error: "Error in finding the employee"});
        }

        await Employee.deleteOne({_id});
        res.status(201).json({ message: "successfull!!.." });


    }catch(err){
        console.log("err=>",err);
        res.status(422).json({error : err});
    }
})



app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})