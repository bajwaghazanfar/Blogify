import React, { useEffect, useState } from "react"
import {useMutation, useQuery}from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import gql from "graphql-tag"
import ReactHtmlParser from 'react-html-parser'
import styles from './BlogPage.module.css'
import Navbar from '../Navbar/Navbar'
import Comment from'./Comments'

const Blog=gql`

query($id:String!){
    findBlog(id:$id){
	id
    title
    body
    image
    postedBy{
        username
        userImage
      }
    createdAt
    comments{
        id
        body
        username
        userPicture
        createdAt
    }
    likes{
        username
        userPicture
        createdAt
        id
      }
    
  }
}
`




const BlogPage=()=>{

    let location = useLocation().pathname.substring('7');
    const {data,loading,error}=useQuery(Blog,{
        variables:{
            id:location
        }
    })
    

    const token=localStorage.getItem('accessToken')
    const history=useHistory()

    if(!token){
        history.push('/login')
    }

data!=null?console.log(data.findBlog):console.log()


  
     

    
    

    return(

        <>
        <Navbar/>
           {data != undefined?
        <div className={styles.container}>
<div className={styles.CoverPhoto}>
{data.findBlog.image!=null?
data.findBlog.image.includes('.mp4')
?
<video width="900" height="450" controls>
    <source  src={`http://localhost:4000/videos/${data.findBlog.image}`}/>
</video>
:
<img src={`http://localhost:4000/images/${data.findBlog.image}`} style={{width:'100%'}} alt=""/>
:<p></p>}
</div>

           <h1 className={styles.blogTitle}><em>{data.findBlog.title}</em></h1>
<div className={styles.BlogBody}>
{ReactHtmlParser(data.findBlog.body)}
</div>

    <h4>Leave a comment</h4>
    <Comment id={data.findBlog.id}/>

        </div>
        
           
        :<p></p>
        }
        
        </>   
        
    )
}

export default BlogPage