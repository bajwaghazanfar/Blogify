
const Blog = require('../models/blog')
const jwt=require('jsonwebtoken')
const config = require('config');
const User = require("../models/user");



const addLike=async(_,{token,postId},context)=>{
   
      const {username,id}=jwt.decode(token)
      const blog=await Blog.findById(postId)
      
      const currentDate=new Date()
      const user=await User.find({name:username})
      let profilePicture;

      user.map(map=>{
          profilePicture=map.profilePicture
      })
     
      
     
      if(blog != null && profilePicture!= null){
        if(blog.likes.find((like)=>like.username===username)){
          
          blog.likes=blog.likes.filter((like)=>like.username!=username)
          await blog.save()
          return({
            ok:true,
            like:null

          })
        }else{
          blog.likes.push({
            createdAt:currentDate.toISOString(),
            username:username,
            userPicture:profilePicture
          })
          await blog.save()
          return({
            ok:true,
            like:[{
              createdAt:currentDate.toISOString(),
              username:username,
              userPicture:profilePicture
    
            }]
          })

        }
        
       
        
      

      }
  }

  module.exports={addLike}