
const Blog = require('../models/blog')
const jwt=require('jsonwebtoken')
const config = require('config');
const User = require("../models/user");


const addComment=async(_,{token,body,postId},context)=>{
    console.log(token)
      const {username,id}=jwt.decode(token)
      const blog=await Blog.findById(postId)
      
      if(body===''){
        return({
          ok:false,
          errors:[{
            path:"Body",
            message:"Please enter a comment"
          }]
        })
      }
      const currentDate=new Date()
      const user=await User.find({name:username})
      let profilePicture;

      user.map(map=>{
          profilePicture=map.profilePicture
      })
      
     
      if(blog != null && profilePicture!= null){
        blog.comments.push({
          createdAt:currentDate.toISOString(),
          body:body,
          username:username,
          userPicture:profilePicture

        })
        await blog.save()
        return({
          ok:true,
          comment:[{
            createdAt:currentDate.toISOString(),
            body:body,
            username:username,
            userPicture:profilePicture
  
          }]
        })
      }
  }
//Delete Comment
  const deleteComment=async(_,{token,commentId,postId})=>{
   
      const {username,id}=jwt.decode(token)
      const blog=await Blog.findById(postId)
      
     
      if(blog != null ){
        if(blog.comments.find((comments)=>comments.id===commentId)){
          blog.comments=blog.comments.filter((comment)=>comment.id!=commentId)
          await blog.save()
          return(true)
        }
  
       
      }
  }
  
  module.exports={addComment,deleteComment}