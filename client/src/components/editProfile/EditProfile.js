import React, { useState, useEffect, useCallback } from 'react';
import gql from 'graphql-tag'
import { useQuery,useMutation } from '@apollo/react-hooks';
import Navbar from '../Navbar/Navbar'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import styles from './EditProfile.module.css'
import {useDropzone} from 'react-dropzone'
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import {motion}from 'framer-motion'
import { useHistory } from "react-router"


const ProfileQuery=gql`
    query($token:String!){
        ProfileQuery(token:$token){
            user{
                name
                email
                profilePicture
              

              }
        }
    }

`
const EDIT_PROFILE=gql`
mutation($newUsername:String,$token:String!,$newPassword:String,$Picture:Upload,$Email:String,$bio:String){
    editProfile(newUsername:$newUsername,token:$token,newPassword:$newPassword,Picture:$Picture,Email:$Email,bio:$bio){
        user{
            name
            email
            profilePicture
          }
            ok
    }
}
`

const EditProfile=()=>{
    const[File,setFile]=useState(null)
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
    const[email,setEmail]=useState('')
    const[bio,setBio]=useState('')
    const[open,setOpen]=useState(false)
        const[editProfile]=useMutation(EDIT_PROFILE)
    const{data,loading,error}=useQuery(ProfileQuery,{
        variables:{
            token:localStorage.getItem('accessToken')
        }
    })

    const history=useHistory()

    if(!localStorage.getItem('accessToken')){
        history.push(`/login`)
    }
    


    const onDrop = useCallback(([file]) => {
        setFile(file)
      }, [editProfile])

      const{getRootProps,getInputProps,isDragActive}=useDropzone({onDrop})

      useEffect(()=>{
        loading?console.log():setUsername(data.ProfileQuery.user.username)
        loading?console.log():setEmail(data.ProfileQuery.user.email)
    
      },[loading])

      const Alert=(props)=>{
        return <MuiAlert elevation={6} variant="filled"{...props}/>
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
  


      const pathVariants={
          hidden:{
              opacity:0,
              pathLength:0
          },
          visible:{
              opacity:1,
              pathLength:1,
              transition:{
                  duration:2,
                  ease:"easeInOut"
              }
          }
      }
      const svgVariants={
          hidden:{
                opacity:1
          },
          visible:{
              rotate:0,
              transition:{
                  duration:1
              }
          }
      }

      const handleSumbit=async(e)=>{
          e.preventDefault()
          console.log(email)
          const response=await editProfile({
              variables:{
                  newUsername:username,
                  newPassword:password,
                  bio:bio,
                  email:email,
                  Picture:File,
                  token:localStorage.getItem('accessToken')

              }

          })
          if(response.data.editProfile.ok){
            setOpen(true)
            setTimeout(()=>{
              history.push(`/profile/${data.ProfileQuery.user.name}`)
            },2000) 
          }else{
              console.log()
          }


      }
      

    return(
        <>
        <Navbar/>
        {loading?<p></p>:
                <div className={styles.container}>
                    <form className={styles.edit} onSubmit={handleSumbit}>
                        <div className={styles.DropzoneWrapper}>
                            <div {...getRootProps()} className={styles.Dropzone}>
                                <input {...getInputProps()} accept="image/*" />
                                {File==null?
                                <img src={`http://localhost:4000/profilePictures/${data.ProfileQuery.user.profilePicture}`}/>
                                :
                                 <motion.svg  variants={svgVariants} initial="hidden" animate="visible" className={styles.Svg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <motion.path 
                                 strokeLinecap="round" 
                                 strokeLinejoin="round" 
                                 strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                 variants={pathVariants}
                                 />
                             </motion.svg>
                                }
                               
                                
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                                </IconButton>

                        </div>
             
                        </div>
                    
                        <TextField id="standard-basic" label="Username" defaultValue={data.ProfileQuery.user.name} onChange={(e)=>setUsername(e.target.value)} />
                        <TextField id="standard-basic" label="Password" onChange={(e)=>setPassword(e.target.value)} />
                        <TextField id="standard-basic" label="Bio" onChange={(e)=>setBio(e.target.value)} />
                        <TextField id="standard-basic" label="Email" defaultValue={data.ProfileQuery.user.email} onChange={(e)=>setEmail(e.target.value)}/>
                    <motion.button
                    whileTap={{scale:1.05}}
                    type="submit"
                    >
                        Sumbit
                    </motion.button>
                    </form>
                    <Snackbar 
                        anchorOrigin={{ vertical:'top', horizontal:'right' }}
                        open={open} 
                        autoHideDuration={6000} 
                        onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                            Your changes have been saved!
                    </Alert>
        
 </Snackbar>

    
            </div>}
        </>
    )
}
export default EditProfile