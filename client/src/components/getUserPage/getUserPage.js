import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag'
import { useQuery,useMutation } from '@apollo/react-hooks';
import styles from './getUserPage.module.css'
import Navbar from '../Navbar/Navbar'
import MenuBookIcon from '@material-ui/icons/MenuBook'; 
import { Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom'
import Blogs from './Blogs'
import SlideModal from './slideModal'
import { useCycle } from 'framer-motion';



const FOLLOW_MUTATION=gql`
mutation($token:String!,$userName:String!){
    followMutation(token:$token,userName:$userName){
        ok
        follow{
          username
          userPicture
        }
    }
}

`
const USER_QUERY=gql`
query($username:String!){
    UserGetQuery(username:$username){
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




const GetUserPage=()=>{
    // LOCATION STATES AND GRAPHQL QUERIES AND MUTATIONS
    const[open,toggleOpen]=useCycle("close","open")
    const[Data,setData]=useState('')
    const[Follow,setFollow]=useState('Follow')

    let location = useLocation().pathname.substring('6');

    const[followMutation]=useMutation(FOLLOW_MUTATION)

    const{data,loading,error}=useQuery(USER_QUERY,{
        variables:{
            username:location
        } 
    })
    // END--------

console.log(data)

    

    const handleFolow=async()=>{
        const response=await followMutation({
            variables:{
                token:localStorage.getItem('accessToken'),
                userName:location
            },
            refetchQueries:[{query:USER_QUERY,variables:{username:location}}]
        })
    response.data.followMutation.follow!=null?setFollow('Unfollow'):setFollow('Follow')
    
    }
    const handleFollowOpen=()=>{
        toggleOpen()
        setData('Followers')
    }
    const handleFollowingOpen=()=>{
        toggleOpen()
        setData('Following')
    }
    
console.log(Follow)
    return(
        <>
        <Navbar/>   
        {data != undefined?
            <div className={styles.Wrapper}>
            <div className={styles.container}>
               <div className={styles.avatar}>   
               <img src={`http://localhost:4000/profilePictures/${data.UserGetQuery.user.profilePicture}`}/>
                <div className={styles.Info}> 
                    <h1>{data.UserGetQuery.user.name}</h1>
                    <p>
                        <button  className={styles.Button}onClick={handleFollowOpen}>{data.UserGetQuery.user.followers.length}</button> Followers    
                        <button  className={styles.Button} onClick={handleFollowingOpen}>{data.UserGetQuery.user.following.length}</button> Following
                    </p>
                    <h5>This is loren ipsum dummy text cuzza;</h5>
                </div>
                <div className={styles.Follow}>
                <Button variant="contained" color="primary" onClick={handleFolow}>
                        {Follow}
                    </Button>
                </div>
               </div>
               <div >
                   <SlideModal data={data.UserGetQuery.user} toggleOpen={toggleOpen} open={open} Data={Data} />
               </div>

              
            </div>
            <hr></hr>
            <div className={styles.Blogs}>
                <Blogs data={data.UserGetQuery.blog}/>
            </div>
            </div>
           
        
            :<div></div>}
        </>

    
    )

}
export default GetUserPage
