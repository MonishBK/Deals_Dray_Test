const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var validator = require('validator');

const HASHINGROUND = process.env.HASHINGROUND;
const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  // f_sno: {
  //   type: Number,
  //   required: true,
  //   trim:true,
  // },
  f_userName: {
    type: String,
    required: true,
    trim:true,
    minlength: [2, "minimum 2 letters"]
  },
  f_Pwd: {
    type: String,
    required: true,
    trim:true,
    minlength: [6, "password can't be less then 6 Charectors"]
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  cretedOn: {
    type: String,
    default: new Date().toLocaleString(),
  },
});

// hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("f_Pwd")) {
    // console.log(Number(process.env.HASHINGROUND),"==> Rounds");
    this.f_Pwd = await bcrypt.hash(this.f_Pwd, Number(process.env.HASHINGROUND));
    // this.cpassword = await bcrypt.hash(this.cpassword, Number(HASHINGROUND));
  }
  next();
});

// generating tockens
userSchema.methods.generateAuthTocken = async function () {
  try {
    // console.log("Secrect key = ",process.env.SECRET_KEY)
    // console.log("hash rounds = ",process.env.HASHINGROUND)
    
    let token = jwt.sign({ _id: this._id, f_userName: this.f_userName, f_Pwd: this.f_Pwd }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    // this.tokens[0] = this.tokens[0] = { token: token };
    await this.save();
    // return token;
    return token;
  } catch (err) {
    console.log(err);
  }
};

// collection creation
const User = mongoose.model("T_LOGIN", userSchema);

// exporting the modules
module.exports = User;  
// export default mongoose.models.User || mongoose.model("T_LOGIN", userSchema);