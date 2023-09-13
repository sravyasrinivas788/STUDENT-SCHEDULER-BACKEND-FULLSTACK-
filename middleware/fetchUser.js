const jwt = require('jsonwebtoken');
const secret_key="Mynameissujal" 

//fetchUser is the middleware function 
const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token')  //Geting the token from the header
    if(!token){
        return res.status(401).json({error:"Enter a token to authenticate"})  //this error is showed if token is not present
    }
    try{
        const data=jwt.verify(token,secret_key);   // jwt.verify() validates the token and returns a decoded object
        req.user=data.user;  //if the token is successfully verified ,then the req is modified with the required user
        next();   // next() is called to execute the next function

    }catch{
        res.status(401).json({error:"Enter a valid token to authenticate"})  //this error is showed if the token is invalid
    }
}

module.exports=fetchUser