const Blog = require('../models/blog')
const jwt=require('jsonwebtoken')
const config = require('config');
const bcrypt=require('bcrypt'); 
const User = require("../models/user");
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require('path')

const followMutation=async(_,{token,userName,},context)=>{

    const {username,id}=jwt.decode(token)

    const currentUser=await User.findOne({name:username})
    const user=await User.findOne({name:userName})
  


    

    if(user != null){

        if(user.followers.find((followers)=>followers.username===username)){
          
          user.followers=user.followers.filter((followers)=>followers.username===userName)
          currentUser.following=currentUser.following.filter((following)=>following.username!=userName)
          await user.save()
          await currentUser.save()
          return({
            ok:true,
            follow:null

          })
        }else{
           
          user.followers.push({
            username:username,
            userPicture:currentUser.profilePicture
          })

          currentUser.following.push({
              username:userName,
              userPicture:user.profilePicture
          })

          await currentUser.save()
          await user.save()
          
          return({
            ok:true,
            follow:[{
              username:username,
              userPicture:currentUser.profilePicture
    
            }]
          })

        }


    }

   
}

const editProfile=async(_,{token,newUsername,Email,newPassword,bio,Picture},context)=>{
  const{id,username}=jwt.decode(token)
  const user=await User.findOne({_id:id})


  if(newUsername!=null && newUsername!=username){
 
    user.name=newUsername
    const allBlogs= await Blog.find({userId:id})
    const allComments=await Blog.find()

    allBlogs.map(async(map,index)=>{
      const res=await Blog.updateMany({userId:id},{postedBy:{username:newUsername,userImage:map.postedBy.userImage}})
    })
allComments.map(async(map,index)=>{

  if(map.comments!=null){
    map.comments.map((map,index)=>{
      map.username===username?map.username=newUsername:map.username=map.username
    
    })
  }
  map.save()
})

const allUsers=User.find()
allUsers.map(async(map,index)=>{
  if(map.followers&&map.following!=null){
    map.followers.map(async(map,index)=>{
      map.username===username?map.username=username:map.username=map.username
      map.save()
    })
    map.following.map(async(map,index)=>{
      map.username===username?map.username=username:map.username=map.username
      map.save()
    })
    map.save()
  }
})
  
  }
  if(Email!=null &&Email!=user.email){
    user.email=Email
  }
  if(newPassword!=null){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(newPassword,salt,async(err , hash)=>{
     
          user.password=hash
          await user.updateOne({password:hash})
        
  
      })
  })
}
  if(bio!=null){
    user.bio=bio
  }
  if(Picture!=null){
    const{createReadStream,filename,encoding,mimetype}=await Picture
  

    await new Promise(res =>
      createReadStream()
        .pipe(createWriteStream(path.join(__dirname, "../profilePictures", filename)))
        .on("close", res),
        user.profilePicture=filename,
  
        
    )

    const allBlogs=await Blog.find({userId:id})
    const allComments=await Blog.find()

    allBlogs.map(async(map,index)=>{
      const res=await Blog.updateMany({userId:id},newUsername!=null?{postedBy:{username:newUsername,userPicture:filename}}
        :{postedBy:{username:username,userPicture:filename}})
    })
allComments.map(async(map,index)=>{
  
  if(map.comments!=null){
    map.comments.map((map,index)=>{
      if(map.username===newUsername||map.username===username && map.profilePicture!=filename){
        map.userPicture=filename
        


      }
    
    })
  }
  map.save()
})

const allUsers=await User.find()
allUsers.map(async(map,index)=>{
  if(map.followers&&map.following!=null){
    map.followers.map(async(map,index)=>{
      console.log(map.userPicture)
      if(map.username===newUsername||map.username===username && map.userPicture!=filename){
        map.userPicture=filename
      }
      
      
     
    })
    map.following.map(async(map,index)=>{
      if(map.username===newUsername||map.username===username && map.userPicture!=filename){
        map.userPicture=filename
      }
     
    })
    map.save()
  }
})

}
await user.save()
return ({
  user:user,
  ok:true
})

  


}
module.exports={followMutation,editProfile}