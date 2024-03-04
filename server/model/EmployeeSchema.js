const mongoose = require("mongoose");
var validator = require('validator');

// Student Resume Data
const EmployeeSchema = new mongoose.Schema({
    f_Name:{
        type: String,
        required: true,
        trim:true,
        minlength: [2, "minimum 2 letters"]
    },

    f_Email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
        validate(value){
          if(!validator.isEmail(value)){
             throw new Error("Email is inValid")
          }
        }
        
    },
    f_Mobile: {
        type:Number,
        required: true,
        unique:true,
        trim:true,
        minlength: [9, "not a valid number"],
        maxlength:[10,  "not a valid number"],
        validate(value){ 
          console.log(value.length <= 9)
          if(value.length <= 9 ){
            throw new Error("invalid number ")
          } 
        }
   
    },
    f_Designation: {
        type:String,
        required: true,
        trim:true,
 
    },
    f_Gender: {
        type: String,
        required: true,
        trim:true,
      
    },
    f_Course: {
        type: Array,
        required: true,
        trim:true,
    },
    f_Image: {
        type:String,
    },
    cretedOn: {
        type: String,
        default: new Date().toLocaleString(),
      },
    
}) 

// collection creation
const Employee = mongoose.model("T_EMPLOYEE", EmployeeSchema);

// exporting the modules
module.exports = Employee;
// export default mongoose.models.EmployeeSchema || mongoose.model("T_EMPLOYEE", EmployeeSchema) 