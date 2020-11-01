const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    registered_date:{
        type:Date,
        default:Date.now()
    },
    profilePicture:{
        type:String,
        required:true
    },
    bio:{
        type:String
    },
    following:[
        {
            username:String,
            userPicture:String,
            userId:String

        }
    ],
    followers:[
        {
            username:String,
            userPicture:String,
            userId:String,

        }
    ]
},{timestamps:true})

const User=mongoose.model('User',userSchema)
module.exports=User