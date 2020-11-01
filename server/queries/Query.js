const Blog = require("../models/blog")
const User = require("../models/user")
const jwt=require('jsonwebtoken')


const blog=async(context)=>{
    
    const allBlogs=await Blog.find()

    return allBlogs.reverse()

}
const user=async()=>{User.find()}

const CommentQuery=async(_,{postId,token})=>{
    const blog= await Blog.findById(postId)
    const {username,id}=jwt.decode(token)
    const comment=blog.comments.reverse()
    return ({
        Comments:comment,
        currentUser:username
    })

}
const LikeQuery=async(_,{postId})=>{
    const blog=await Blog.findById(postId)
    return blog.likes
}
const GetUserQuery=async(_,{token})=>{
    const {username,id}=jwt.decode(token)

    return username
}
const ProfileQuery=async(_,{token},context)=>{
  
  
    const {id}=jwt.decode(token)
    
  
      const allBlogs= await Blog.find({userId:id})
      const profilePage = await User.findById(id)
  
      return ({
        user:profilePage,
        blog:allBlogs
      })
  }
  const UserGetQuery=async(_,{username},context)=>{
      const user=await User.findOne({name:username})
      const id=user.id
      const allBlogs= await Blog.find({userId:id})

      return({
          user:user,
          blog:allBlogs
      })



  }

  const findBlog=async(_,{id},context)=>{
    const blog= await Blog.findById(id)

    return(blog)



}

module.exports={blog,user,CommentQuery,LikeQuery,GetUserQuery,ProfileQuery,UserGetQuery,findBlog}