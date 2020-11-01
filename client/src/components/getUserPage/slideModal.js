import CloseIcon from '@material-ui/icons/Close';
import {motion}from 'framer-motion'
import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import styles from './getUserPage.module.css'


const SlideModal=({data,open,toggleOpen,Data})=>{
    const variants={
        open:{
             opacity:1,
             x:0,
             transition:{
                 duration:0.5,
                 staggerChildren:0.7
             }
        },
        close:{
            opacity:0,
            x:'-100vw'  
        },

    }
    const userVariants={
        open: {
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3,
              },
          },
          close: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
          }
    }
       
    return(
        <div>
        {data !=undefined?
            
                <motion.div 
                variants={variants}
                animate={open}
                className={styles.Show}>
                    <div className={styles.btn}><Button onClick={()=>{toggleOpen()}}><CloseIcon/></Button></div>
                    <h1>{Data}</h1>
                    {Data==='Followers'
                    ?data.followers.map(map=>(
                        <motion.div className={styles.user} whileHover={{scale:1.05}} variants={userVariants} animate={open}>
                        <img src={`http://localhost:4000/profilePictures/${map.userPicture}`}/>
                        <h3>{map.username}</h3>
                        </motion.div>
                        ))
                    :data.following.map(map=>(
                        <motion.div className={styles.user} whileHover={{scale:1.05}} variants={userVariants} animate={open}>
                        <img src={`http://localhost:4000/profilePictures/${map.userPicture}`}/>
                        <h3>{map.username}</h3>
                        </motion.div>
                        ))}

                </motion.div>
           
           
             
        :<p></p>}
        </div>
    )
}
export default SlideModal