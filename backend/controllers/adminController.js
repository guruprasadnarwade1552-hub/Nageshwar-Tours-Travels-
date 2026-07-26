import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {

    findAdminByUsername

} from "../models/adminModel.js";



export const loginAdmin = async(req,res)=>{

try{

const {username,password}=req.body;

if(!username || !password){

return res.status(400).json({

success:false,

message:"Username and Password required"

});

}

const admin=

await findAdminByUsername(username);

if(!admin){

return res.status(401).json({

success:false,

message:"Invalid Username"

});

}

const match=

await bcrypt.compare(

password,

admin.password

);

if(!match){

return res.status(401).json({

success:false,

message:"Wrong Password"

});

}

const token=

jwt.sign(

{

id:admin.id,

username:admin.username

},

process.env.JWT_SECRET,

{

expiresIn:process.env.JWT_EXPIRES

}

);

res.json({

success:true,

message:"Login Successful",

token,

admin:{

id:admin.id,

username:admin.username,

email:admin.email

}

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,

message:"Server Error"

});

}

};



export const getAdminDashboard=(req,res)=>{

res.json({

success:true,

message:"Welcome Admin",

admin:req.admin

});

};