
const Blog = require('../models/blog')
const jwt=require('jsonwebtoken')
const config = require('config');
const User = require("../models/user");

const searchMutation=async(_,{query})=>{
    console.log(query)
    if(query!=null){
        const blog= await Blog.find({title:query})
        const user=await User.find({name:query})
        
        
        return({
            Blogs:blog,
            Users:user
        })
    }
}


module.exports=searchMutation

     
    
