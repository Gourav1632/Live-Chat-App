import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
const register = async (req, res, next)=>{
    try{
        const {username,email,password} = req.body;
        const usernameCheck = await User.findOne({username}); // find if there is existing username
        if(usernameCheck){
            return res.json({msg:"Username already exists.",status:false});
        }
    
        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already registered.",status:false});
        }
    
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            username,
            email,
            password:hashedPassword,
        })
        delete user.password;
        return res.json({status:true,user});    
    }catch(err){
        next(err);// pass error 
    }
};

const login = async (req, res, next)=>{
    try{
        const {username,email,password} = req.body;
        const user = await User.findOne({username}); // find if there is existing username
        if(!user){
            return res.json({msg:"Incorrect username or password.",status:false});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.json({msg:"Incorrect username or password.",status:false});
        }
        delete user.password;
        return res.json({status:true,user});    
    }catch(err){
        next(err);// pass error 
    }
};



export {register,login}