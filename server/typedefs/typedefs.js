const { gql } = require('apollo-server-express'); 
 
 const typeDefs = gql`
type Query {
  hello: String
  blog:[Blog]
  user:[User]
  CommentQuery(postId:String!,token:String!):CommentQueryResult
  LikeQuery(postId:String!):[Like]
  GetUserQuery(token:String!):String
  messages:[Message]
  ProfileQuery(token:String!):ProfilePage
  UserGetQuery(username:String!):ProfilePage
  findBlog(id:String!):Blog
}
type EditReturn{
  user:User
  ok:Boolean
}
type Message{
  id:ID!
  user:String!
  content:String!
}
type CommentQueryResult{
  Comments:[Comment]
  currentUser:String
}

type Blog{
  id:ID!
  title:String!
  body:String
  image:String
  userId:String!
  postedBy:PostedBy!
  createdAt:String!
  comments:[Comment]
  likes:[Like]
  summary:String!
}
type PostedBy{
  username:String!
  userImage:String!
}
type Comment{
  id:ID!
  createdAt:String!
  username:String!
  body:String!
  userPicture:String!
}

type Like{
  id:ID!
  createdAt:String!
  username:String!
  userPicture:String!
}
type User{
  id:ID!
  name:String!
  email:String!
  bio:String!
  isAdmin:Boolean
  profilePicture:String
  followers:[Follow]
  following:[Follow]

}
type Error {
  path: String!
  message: String
}
type LoginResponse{
  accessToken:String
  refreshToken:String
  ok:Boolean!
  errors:[Error!]
}
type RegisterResponse{
  user:User
  accessToken:String
  refreshToken:String
  ok:Boolean!
  errors:[Error!]
}
type CommentResponse{
  comment:[Comment]
  ok:Boolean!
  errors:[Error!]
}
type LikeResponse{
  like:[Like]
  ok:Boolean!
  errors:[Error!]
}

type ProfilePage{
  user:User
  blog:[Blog]
}
type Search{
  Blogs:[Blog]
  Users:[User]
}
type Follow{
  id:ID!
  username:String!
  userPicture:String!
  userId:String!
}
type FollowResponse{
  follow:[Follow]
  ok:Boolean!
  errors:[Error!]
 
}

type Mutation{
  followMutation(token:String!,userName:String!):FollowResponse

  deleteBlog(blogID:String!):Boolean!

  searchMutation(query:String!):Search

  editBlog(title:String,body:String,file:Upload,images:[Upload],summary:String,blogID:String!):Boolean
  editProfile(token:String!,newUsername:String,Email:String,Picture:Upload,newPassword:String,bio:String):EditReturn

  addBlog(title:String!,body:String,file:Upload,token:String!,images:[Upload],summary:String!):Boolean
  addUser(name:String!,email:String!,password:String!,profilePicture:Upload):RegisterResponse
  addComment(token:String!,body:String!,postId:String!):CommentResponse
  addLike(token:String!,postId:String!):LikeResponse

  removeLike(token:String!,postId:String!):Boolean

  loginUser(email:String!,password:String!):LoginResponse

  findBlog(id:String!):Blog
  profilePage(token:String!):ProfilePage

  deleteComment(commentId:String!,token:String!,postId:String!):Boolean
}

`;

module.exports=typeDefs