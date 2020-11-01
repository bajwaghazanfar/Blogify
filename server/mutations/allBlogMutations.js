const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require('path')
const Blog = require('../models/blog')
const jwt=require('jsonwebtoken')
const config = require('config');
const User = require("../models/user");


const addBlog =async (_,{title,body,file,token,images,summary})=>{
  let newFilename;
  let UserName;
  let ProfilePicture;
  let BlogImages=[]
  console.log(summary)



  const blog = new Blog({
    title:title,
    body:body,
    summary:summary
  })
 
  
   
    try {
      if(images!=null){
        const awaitedImages=await images
        awaitedImages.map(async(value)=>{
          const map=await value
          const{createReadStream,filename,encoding,mimetype}=await map
          await new Promise(res =>
            createReadStream()
              .pipe(createWriteStream(path.join(__dirname, "../blogImages", filename)))
              .on("close", res),
              console.log(filename),
              
            
            BlogImages.push({image:filename}),           
              blog.blogImages=BlogImages
          )
        })

      }
      
    } catch (error) {
      console.log(error)
      
    }

    

    
    
  try {
    if(file!=null){
      const{createReadStream,filename,encoding,mimetype}=await file

      if(filename.includes('.mp4') && filename!=null){
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../videos", filename)))
            .on("close", res),
            blog.image=filename,
            
        )
      }else{
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../images", filename)))
            .on("close", res),
            blog.image=filename,
           
        )
      }
    }else{
      console.log("SAODJSAODAJKSD")
      
    }
    
  } catch (error) {
    console.log(error)
  }


    
    try {
      const {id,username}=jwt.decode(token)
      userId=id
     
      const{profilePicture}=await User.findById(id)
      blog.userId=id,
      blog.postedBy={
        username:username,
        userImage:profilePicture
      }

  } catch (error) {
      console.log(error)
  }
      
      await blog.save()
      return true
  }

  const findBlog =async (_,{id})=>{
    
    const newBlog=await Blog.findById(id)

    return newBlog
  }

const profilePage=async(_,{token},context)=>{
  
  
  const {id}=jwt.decode(token)
  

    const allBlogs= await Blog.find({userId:id})
    const profilePage = await User.findById(id)

    return ({
      user:profilePage,
      blog:allBlogs
    })
}
const editBlog=async(_,{title,body,file,images,summary,blogID},context)=>{

  const blog=await Blog.findById(blogID)
  if(title!=undefined){
    blog.title=title
  }

  if(body!=undefined){
    blog.body=body
  }

  try {
    if(file!=null){
    
      const{createReadStream,filename,encoding,mimetype}=await file
      console.log(filename)

      if(filename.includes('.mp4') && filename!=null){
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../videos", filename)))
            .on("close", res),
            blog.image=filename,
            
        )
      }else{
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../images", filename)))
            .on("close", res),
            blog.image=filename,  
           
        )
      }
    }else{
      console.log()
      
    }
    
  } catch (error) {
    console.log(error)
  }

  //BLOGIMAGES
  let BlogImages=[]

  try {
    if(images!=null){
      const awaitedImages=await images
      awaitedImages.map(async(value)=>{
        const map=await value
        const{createReadStream,filename,encoding,mimetype}=await map
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../blogImages", filename)))
            .on("close", res),
            console.log(filename),
            
          
          BlogImages.push({image:filename}),          
          console.log(BlogImages),
            blog.blogImages=BlogImages
        )
      })

    }
    
  } catch (error) {
    console.log(error)
    
  }

  //SUMMARY
  if(summary!=undefined){
    blog.summary=summary
  }
  blog.save()
  return(true)
}
const deleteBlog=async(_,{blogID},context)=>{
  if(blogID!=null){
   const blog=await Blog.findByIdAndDelete(blogID)
   return true

  }

}

 module.exports={
   addBlog,findBlog,profilePage,editBlog,deleteBlog
 }