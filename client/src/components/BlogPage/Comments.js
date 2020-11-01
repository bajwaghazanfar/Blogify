import React, { useEffect, useState } from "react"
import {useMutation, useQuery}from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import gql from "graphql-tag"
import styles from './BlogPage.module.css'
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Button from '@material-ui/core/Button';
import Like from './Like'
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';    

const CommentMutation=gql`
mutation($token:String!,$body:String!,$postId:String!){
    addComment(token:$token,body:$body,postId:$postId){
        ok
        comment{
            body
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
const COMMENT_QUERY=gql`
query($postId:String!,$token:String!){
    CommentQuery(postId:$postId,token:$token){
        Comments{
                 id
          body
          createdAt
          userPicture   
          username
          
        }
        currentUser
      }
  }
  `
  const DELETE_COMMENT=gql`
  mutation($postId:String!,$token:String!,$commentId:String!){
    deleteComment(postId:$postId,token:$token,commentId:$commentId)

    
}
  
  `

const Comment=({id})=>{
// Token and location
    const token=localStorage.getItem('accessToken')
    const history=useHistory()
    let location = useLocation().pathname.substring('7');

// Use State Hooks
    const[Comment,setComment]=useState('')
    const[Length,setLength]=useState(0)
    const[CommentData,setCommentData]=useState(null)

// Graphql Mutations and Queries
    const [addComment]=useMutation(CommentMutation)
    const[deleteComment]=useMutation(DELETE_COMMENT)
    const { loading, error, data } = useQuery(COMMENT_QUERY,{
        variables:{
            postId:location,
            token:token
        }
    });




    //Handle Comment function
    const handleComment=async(e)=>{
        e.preventDefault();
        const response=await addComment({
            variables:{
                body:Comment,
                token:token,
                postId:location,
            },

            refetchQueries:[{query:COMMENT_QUERY,variables:{postId:location,token:token}}]
        })


    }

    //Handle time for each comment
    const handleTime=(time)=>{
        if(time){
            const date=time.slice(0,10)
            const hours=time.slice(11,16)
            
            return `${date} at ${hours}`
        }
        else return null
        
    }
    
    //Handle Each Commment Delete
    const handleDelete=async(map)=>{
        const response=await deleteComment({
            variables:{
                token:token,
                commentId:map.id,
                postId:id
            },
            refetchQueries:[{query:COMMENT_QUERY,variables:{postId:location,token:token}}]
        })
    }
    return(
        
    <div>
        <hr></hr>
{loading!=true?
    <div className={styles.Icons}>
        <Like/>
    <span><IconButton><ChatBubbleOutlineIcon/></IconButton>   <h5>{data.CommentQuery.Comments.length}</h5></span>
    </div>
    :
    <div className={styles.Loader}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={40}
          thickness={4}
        />
      </div>
}
    
        <form className={styles.addComment} onSubmit={handleComment}>
    <TextField id="outlined-basic" variant="outlined"defaultValue="" label="Enter Comment" onChange={(change)=>setComment(change.target.value)} />
    
    <Button
        variant="contained"
        color="default"
        type="submit"
        startIcon={<SendIcon/>}
      >
        Submit
      </Button>
    </form>
    {loading!=true?data.CommentQuery.Comments.map((map,index)=>(
        <div className={styles.comments} key={index}>
            <div className={styles.Delete}>
                <Button  
                onClick={()=>{handleDelete(map)}}
                style={data.CommentQuery.currentUser!=map.username?{visibility:'hidden'}
                :{visibility:'visible'}}>
                <DeleteOutlineIcon/>
                </Button>
            </div>
            <div className={styles.postedBy}>
                <img src={`http://localhost:4000/profilePictures/${map.userPicture}`}/>      
                <h5>{map.username} Says:</h5>
                </div>
                <h6 >{handleTime(map.createdAt)}</h6>
                <p>{map.body}</p>
            </div>
        )):
        <div className={styles.Loader}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={40}
          thickness={4}
        />
      </div>
        }
        
        </div>
    )


}
export default Comment