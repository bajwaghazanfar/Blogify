import React,{useEffect,useState} from 'react';
import styles from './Navbar.module.css'
import gql from "graphql-tag"
import { useHistory, useLocation } from 'react-router-dom'
import {useMutation}from '@apollo/react-hooks'
import PersonIcon from '@material-ui/icons/Person';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import SearchIcon from '@material-ui/icons/Search';
import {motion}from 'framer-motion'


const ProfileMutation=gql`
    mutation($token:String!){
        profilePage(token:$token){
            blog{
                body
              title
            }
            user{
                name
                email
                profilePicture
              }
        }
    }

`



const Navigation=()=>{
  const [profilePage,{data,loading,error}]=useMutation(ProfileMutation)
  const[open,setOpen]=useState(false)
  const history=useHistory()
    

  useEffect(()=>{
      profilePage({
          variables:{
              token:localStorage.getItem('accessToken')
          }
      })
      
  },[])
  console.log(data)

  const handleSignOut=()=>{
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    history.push('./login')

  }
    return(
<div 
  className={styles.Wrapper}

  >
    <nav>
    <a href="/"><motion.div 
    className={styles.Logo}
    whileHover={{scale:1.1}}
    whileTap={{scale:1.2}}
     >
      Blogify
    </motion.div></a>

      <ul>
      <li >
        <a href="#"  >
        <PersonOutlineIcon /></a>
          <ul>
            
          <li><a href={data!=null?`http://localhost:3000/profile/${data.profilePage.user.name}`:'#'}>Profile</a></li>
          <li><a href="" onClick={handleSignOut}>Sign Out</a></li>
          
          </ul>
        </li>
        <motion.li  whileHover={{scale:1.3}}><a href='/search'><SearchIcon/></a></motion.li>
        <motion.li whileHover={{scale:1.3}}><a href='https://www.linkedin.com/in/ghazanfar-bajwa-b183531a7/'><ContactMailIcon/></a></motion.li>

        </ul>
      </nav>
</div>

    )
}
export default Navigation