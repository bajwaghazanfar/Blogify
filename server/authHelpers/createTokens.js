const jwt=require('jsonwebtoken')
const config=require('config')
const User = require('../models/user')


const createTokens=(user)=>{
    
    const accessToken=jwt.sign({
        id:user.id,
        username:user.name,
        email:user.email,
        isAdmin:user.isAdmin},
        config.get('jwtSecret'),
        {expiresIn:'1m'
    })
    const refreshToken=jwt.sign({
        id:user.id,
        email:user.email,
        username:user.name,
        isAdmin:user.isAdmin},
        config.get('jwtSecret'),
        {expiresIn:'1d'
    })
    return{accessToken,refreshToken}

}

const refreshTokens= async(accessToken,refreshToken)=>{
    let userId;

try {
    const {id}=jwt.decode(refreshToken)
    userId=id
} catch (error) {
    console.log(error)
}

if(!userId){
    return{}
}
const user=await User.findById(userId)

try {
    jwt.verify(refreshToken,config.get('jwtSecret'))
    const newTokens=createTokens(user)
    console.log("SDASKJFHAKJFSALKDLKSAJSAKLJ")
    return{
        newAccessToken:newTokens.accessToken
    }
} catch (error) {
    return {
        err:error
    }

}
    

}

module.exports={createTokens,refreshTokens} 