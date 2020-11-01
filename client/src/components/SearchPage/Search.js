import React,{useEffect,useState} from 'react';
import styles from './Card.module.css'
import SearchStyles from './Search.module.css'
import gql from "graphql-tag"
import { useHistory, useLocation } from 'react-router-dom'
import {useMutation, useQuery}from '@apollo/react-hooks'
import SearchIcon from '@material-ui/icons/Search';
import Navbar from '../Navbar/Navbar'
import {motion} from 'framer-motion'
import {isMobile} from "react-device-detect";

const SEARCH_MUTATION=gql`
mutation($query:String!){
    searchMutation(query:$query){
        Users{
            name
            profilePicture
          }
          Blogs{
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
    }
}

`


const Search=()=>{
    const[search,setSearch]=useState('')
    const[data,setData]=useState(null)
    const[searchMutation]=useMutation(SEARCH_MUTATION)

    

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const response=await searchMutation({
            variables:{
                query:search
            }
        })
        setData(response.data.searchMutation)
        console.log(response.data.searchMutation)
    }

    const handleSummary=(summary)=>{
        if(summary!=null){
        return(
          summary.slice(0,30)
        )
        }
        else{
            return null
        }
      }
      const handleReadTime=(body)=>{
        const wordsPerMinute = 200;
        const result= Math.ceil(body.length/wordsPerMinute)
        return result
      
      }
     console.log(data)
    return(
<>
    <Navbar/>
    <div className={SearchStyles.wRapper}>
    <form onSubmit={handleSubmit} className={SearchStyles.form}>
    <motion.input animate={{scale:1.1}} transition={{duration:.9}} type="text"placeholder="Search for a movie" className={SearchStyles.input} onChange={(e)=>setSearch(e.target.value)} ></motion.input>
     </form>
    </div>
{data!=null
?
<div className={styles.container}> 
    {data.Blogs.map(data=>(
        <motion.div key={data.id} className={styles.card} whileHover={isMobile==false?{scale:1.05}:{scale:1}}  >
        {data.image!=null ?data.image.includes('.mp4')
          ?
        <div className={styles.media}>
          <video autoPlay="true">
            <source src={`http://localhost:4000/videos/${data.image}`} type="video/mp4"/>
          </video>
        </div>
          :
          <div className={styles.media}><img src={data.image!=null?`http://localhost:4000/images/${data.image}`:'https://i.pinimg.com/originals/bf/82/f6/bf82f6956a32819af48c2572243e8286.jpg'} style={{width:'100%'}} alt=""/></div>:<p></p>
        }
        <div className={styles.cardText}>
        <a href={`/blogs/${data.id}`}>
          <h2>{data.title}</h2>
          <p >{handleSummary(data.summary)}...</p></a>
        </div>
         <div className={styles.user}>
              <a href={`profile/${data.postedBy.username}`}>
                <img src={`http://localhost:4000/profilePictures/${data.postedBy.userImage}`} style={{maxWidth:'70px',padding:'10px',borderRadius:'50%'}}/></a>
                <h5>Posted by {data.postedBy.username}</h5>
          </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.value}>
              {data.comments!=null?data.comments.length:0}
            </div>
            <div className={styles.type}>Comments</div>
          </div>
        
          <div className={styles.statBorder}>
            <div className={styles.value}>
              {data.likes!=null?data.likes.length:0}
            </div>
            <div className={styles.type}>Likes</div>
          </div>
        
          <div className={styles.stat}>
            <div className={styles.value}>
             {handleReadTime(data.body)}<sup>m</sup>
            </div>
            <div className={styles.type}>Read</div>
          </div>
        
        </div>
        
        
        
        
        
        
            
        </motion.div>
    ))}
</div>
:<p></p>}
</>
    )
}
export default Search