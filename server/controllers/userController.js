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

export {register}