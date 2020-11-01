import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag'
import { useQuery,useMutation } from '@apollo/react-hooks';
import styles from './ProfilePage.module.css'
import Navbar from '../Navbar/Navbar'
import Blogs from './Blogs'
import SlideModal from './slideModal'
import { useCycle } from 'framer-motion';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
const ProfileQuery=gql`
    query($token:String!){
        ProfileQuery(token:$token){
            blog{
                summary
                id
                title
                body
                image
                createdAt
                likes{
                  username
                }
                comments{
                  body
                  createdAt
                  username
                  userPicture
                }
              postedBy{
                username
                userImage
              }
            }
            user{
                name
                email
                profilePicture
                followers{
                    id
                    userPicture
                    username
                }
                following{
                    id
                    username
                }
              }
        }
    }

`
const DELETE_MUTATION=gql`
mutation($blogID:String!){
    deleteBlog(blogID:$blogId)
}
`
const ProfilePage=()=>{
    const[open,toggleOpen]=useCycle("close","open")
    const [anchorEl, setAnchorEl] =useState(null);
    const[Data,setData]=useState('')
    const {data,loading,error}=useQuery(ProfileQuery,{
        variables:{
            token:localStorage.getItem('accessToken'),
        },
    })
    

    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    const handleFollowOpen=()=>{
        toggleOpen()
        setData('Followers')
    }
    const handleFollowingOpen=()=>{
        toggleOpen()
        setData('Following')
    }

    return(
        <>
        <Navbar/>
            {data != undefined?
            <div className={styles.Wrapper}>
            <div className={styles.container}>
               <div className={styles.avatar}>   
               <img src={`http://localhost:4000/profilePictures/${data.ProfileQuery.user.profilePicture}`}/>
                <div className={styles.Info}> 
                    <h1>{data.ProfileQuery.user.name}</h1>
                    <p>
                        <button onClick={handleFollowOpen}>{data.ProfileQuery.user.followers.length}</button> Followers    
                        <button  onClick={handleFollowingOpen}>{data.ProfileQuery.user.following.length}</button> Following
                    </p>
                    <h5>This is loren ipsum dummy text cuzza;</h5>
                </div>
                <div className={styles.Edit}>
                    <IconButton
                    aria-controls="simple-menu" 
                    aria-haspopup="true" 
                    variant=""
                    onClick={handleClick}
                    style={{left:'20px',color:'black'}}
                    >
                        <MoreVertIcon />
                    </IconButton>
            <Menu
                 id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
               open={Boolean(anchorEl)}
                        onClose={handleClose}
            >
            <MenuItem><a href={`/editProfile/`}>Edit</a></MenuItem>
            </Menu>
          </div>
               </div>
               <div>
                   <SlideModal data={data.ProfileQuery.user} toggleOpen={toggleOpen} open={open} Data={Data} />
               </div>

              
            </div>
            <hr></hr>
            <div className={styles.Blogs}>
                <Blogs data={data.ProfileQuery.blog} ProfileQuery={ProfileQuery}/>
            </div>
            </div>
           
        
            :<div></div>}
        </>

    )


}
export default ProfilePage