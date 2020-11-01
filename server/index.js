
const express = require('express');
const multiparty=require('connect-multiparty')

const { ApolloServer} = require('apollo-server-express');
const mongoose=require("mongoose");

const Blog = require('./models/blog');
const path = require("path");
const bodyparser=require('body-parser')
const User=require('./models/user')
const auth=require('./mutations/authentication')
const blogs=require('./mutations/allBlogMutations')
const comments=require('./mutations/commentMutations')
const likes=require('./mutations/likeMutation.js')
const config=require('config')
const dbURI=config.get('mongoURI')
const jwt=require('jsonwebtoken')
const cors=require('cors')
const create=require('./authHelpers/createTokens.js')
const typeDefs = require('./typedefs/typedefs')
const queries= require('./queries/Query')
const Profile=require('./mutations/ProfileMutations')





const followMutation=Profile.followMutation
const editProfile=Profile.editProfile

const addUser=auth.addUser
const loginUser=auth.loginUser

const deleteBlog=blogs.deleteBlog
const addBlog=blogs.addBlog
const editBlog=blogs.editBlog
const profilePage=blogs.profilePage

const addLike=likes.addLike
const addComment=comments.addComment
const deleteComment=comments.deleteComment


const searchMutation=require('./mutations/searchMutation')

//Queries

const blog=queries.blog
const user=queries.user
const CommentQuery=queries.CommentQuery
const LikeQuery=queries.LikeQuery
const GetUserQuery=queries.GetUserQuery
const ProfileQuery=queries.ProfileQuery
const UserGetQuery=queries.UserGetQuery
const findBlog=queries.findBlog
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    findBlog,
    UserGetQuery,
    ProfileQuery,
    blog,
    user,
    CommentQuery,
    LikeQuery,
    GetUserQuery,
  },
  Mutation:{
    editProfile,
    deleteBlog,
    followMutation,
    addBlog,
    editBlog,
    addUser,
    addComment,
    loginUser,
    profilePage,
    addLike,
    deleteComment,
    searchMutation
    
  }
};

 
const app = express();
app.use(cors())
const server = new ApolloServer(
  { 
    typeDefs,
    uploads: {
      // Limits here should be stricter than config for surrounding
      // infrastructure such as Nginx so errors can be handled elegantly by
      // graphql-upload:
      // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
      maxFileSize: 5000000000000, // 50 MB
      maxFiles: 30,
      maxFieldSize: 500000000000, // 50 MB
      },
    resolvers,
    context:async({req,res})=>{
      const accessToken=req.headers.accesstoken
      const refreshToken=req.headers.refreshtoken
      
      if(!refreshToken && !accessToken){
        return{user:'No token'}
      }
      
      try {
        if(accessToken){
          const data=jwt.verify(accessToken,config.get('jwtSecret')) 
          
          return{user:'JWT IS VERIFIED'}     
        }
      } catch (error) {
        const refreshTokens=create.refreshTokens
        const newTokens=await refreshTokens(accessToken,refreshToken)
        if(newTokens.newAccessToken&&!newTokens.newRefreshToken){
          res.set('Access-Control-Expose-Headers', 'refreshToken, accessToken')
          res.set('accessToken',newTokens.newAccessToken)
        }
        if(newTokens.err){
          res.set('Access-Control-Expose-Headers', 'error')
          res.set('error','Session has timed out please log back in')

        }
        
        
      }
    }
  });

  app.use(express.json({ limit: "50mb" }));
server.applyMiddleware({ 
    app,
    bodyParserConfig:false
  });

  if(process.env.NODE_ENV==='production'){
    app.use(express.static('./client/build'))
    
    app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirname,'./client','build','index.html'))
    })
  }
  
  



app.use('/images',express.static(path.join(__dirname,"./images")))
app.use('/videos',express.static(path.join(__dirname,"./videos")))
app.use('/profilePictures',express.static(path.join(__dirname,"./profilePictures")))


const PORT=process.env.PORT || 4000
mongoose.connect(process.env.MONGODB_URI||dbURI,{useNewUrlParser:true,useUnifiedTopology:true})



.then(
app.listen(PORT , () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
))
.catch(err=>console.log(err))