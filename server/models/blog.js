const mongoose=require('mongoose')
const Schema=mongoose.Schema

const blogSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
    },
    image:{
        type:String
    },
    blogImages:[
        {
            image:String,

        }
    ],
    postedBy:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    comments:[
        {
            body:String,
            username:String,
            createdAt:String,
            userPicture:String
        }
    ],
    likes:[
        {
            username:String,
            createdAt:String,
            userPicture:String
        }
    ],
    postedBy:
        {
            type:Object,
            username:String,
            userImage:String,

        },
        userId:{
            type:String
        }
    
},{timestamps:true})

const Blog=mongoose.model('Blog',blogSchema)
module.exports=Blog