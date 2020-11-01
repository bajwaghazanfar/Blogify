const User=require('../models/user')
const bcrypt=require('bcrypt'); 
const jwt=require('jsonwebtoken')
const create=require('../authHelpers/createTokens')

const addUser=async(_,{name,email,password,profilePicture})=>{

    let actualFilename;

    if(profilePicture!=null){
        const{createReadStream,filename,encoding,mimetype}=await profilePicture
        actualFilename=filename

        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../profilePictures", filename)))
            .on("close", res),
            
        )
    }
    actualFilename='default.jpg'

    const user=await User.findOne({email})
    if(user){
        return({
            ok:false,
            errors:[{
                path:"email",
                message:"A account with that email already exists"
            }]
        })
    }
    if(password.length < 8 || password.length > 20){
        return({
            ok:false,
            errors:[{
                path:"password",
                message:"Password must be between 8 and 20 characters"
            }]
        })
    }
    const newUser=new User({
        name,
        email,
        password,
        isAdmin:false,
        profilePicture:actualFilename
    });

    //Salt and Hash(scramble password)
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,async(err , hash)=>{
            newUser.password=hash
            await newUser.save()
            .catch(err=>{console.log(err)})
        })
    })
    const createTokens=create.createTokens
    const {accessToken,refreshToken}=createTokens(newUser)
       
    return({
        user:{
            id:newUser.id,
            name:newUser.name,
            email:newUser.email,
            password:newUser.password,
            isAdmin:false,
            profilePicture:actualFilename
           
        },
        accessToken:accessToken,
        refreshToken:refreshToken,
        ok:true,
        
    })
}
//Login User------------------------------

const loginUser=async(parent,{email,password},context)=>{
   console.log(context.user)
    

    const user=await User.findOne({email})
    if(!user){
        return({
            ok:false,
            errors:[{
                path:"email",
                message:"Invalid Email"
            }]
        })
    }
    const validate=await bcrypt.compare(password,user.password)
    if(!validate){
        return{
            ok:false,
            errors:[{
                path:"email",
                message:"Invalid Password"
            }]
        }
    }
    const createTokens=create.createTokens
    const {accessToken,refreshToken}=createTokens(user)

    return{
        ok:true,
        accessToken:accessToken,
        refreshToken:refreshToken
    }


    }

module.exports={
    addUser,loginUser
}


