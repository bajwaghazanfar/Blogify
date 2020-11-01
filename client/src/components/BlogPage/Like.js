import React, { useEffect, useState } from "react"
import {useMutation, useQuery}from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import gql from "graphql-tag"

import styles from './BlogPage.module.css'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const LikeMutation=gql`
mutation($token:String!,$postId:String!){
    addLike(token:$token,postId:$postId){
        ok
        like{
            
            createdAt
            username
            userPicture
            
          }
          errors{
            message
          }
    }
}
`
const LIKE_QUERY=gql`

query($postId:String!){
    LikeQuery(postId:$postId){
      id
      createdAt
      username
    }
  }
`

const Like=()=>{
// Token and location
const token=localStorage.getItem('accessToken')
const history=useHistory()
let location = useLocation().pathname.substring('7');

//States
const[open,setOpen]=useState(false)
const[message,setMessage]=useState('')
//Graphql Mutation and Query
    const [addLike]=useMutation(LikeMutation)
    const {loading,data,error}=useQuery(LIKE_QUERY,{
        variables:{
            postId:location
        }
    })
    


    const handleClick=async(e)=>{
        const response=await addLike({
            variables:{
                token:token,
                postId:location,
            },
            refetchQueries:[{query:LIKE_QUERY,variables:{postId:location}}]
        })
        console.log(response)
        const {data:{addLike:{errors,like,ok}}}=response
        if(like!=null){
            setOpen(true)
            setMessage('Added to liked blogs')
            setTimeout(()=>
            { 
                setOpen(false)
            }, 2000);
        }
        if(like==null){
            setOpen(true)
            setMessage('Removed from liked blogs')
            setTimeout(()=>
            { 
                setOpen(false)
            }, 2000);
        }
    }
    const handleClose = () => {
        setOpen(false)
      };
    return(
    <>
    {loading!=true?
    <div>
        <span>
            <IconButton 
            onClick={()=>{handleClick()}}>
            <FavoriteBorderIcon variant="contained" />
            </IconButton >
            <h5>{data.LikeQuery.length}</h5>
        </span>

        <Snackbar
         anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
        open={open}
        message={message}
        autoHideDuration={3000}
      />
    </div>
    

        
    :<p></p>}
    </>
    )
}
export default Like