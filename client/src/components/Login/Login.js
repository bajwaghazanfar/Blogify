import React,{useState} from 'react'
import styled from 'styled-components'
import styles from './Login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons';
import {  faLock } from '@fortawesome/free-solid-svg-icons';
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import rocket from './rocket.svg'
import gql from 'graphql-tag'
import { useMutation , useQuery } from "@apollo/react-hooks";
import { useHistory,Redirect } from "react-router-dom"
import {motion}from 'framer-motion'

const LoginMutation=gql`

    mutation($email:String!,$password:String!){
        loginUser(email:$email,password:$password){
            accessToken
            refreshToken
            ok
            errors{
                path
                message
            }

        }
    }
`


const Login=()=>{
    const[Email,setEmail]=useState('')
    const[Password,setPassword]=useState('')
    const[error,setError]=useState(null)
    const [ok,setOk]=useState(false)
    const[loginUser]=useMutation(LoginMutation)

    const history=useHistory()
    let err;
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const response=await loginUser({
            variables:{
                email:Email,
                password:Password
            }
        })
        const{accessToken,refreshToken,errors,ok}=response.data.loginUser
        
        
        if(ok) {
            localStorage.setItem('accessToken',accessToken)
            localStorage.setItem('refreshToken',refreshToken)
            setTimeout(()=>{history.push("/")},2000)
            setOk(true)
        }else{
            setOk(false)
            console.log(errors[0].message)
            setError(errors[0].message)
            setTimeout(()=>{ setError(null); }, 2000)
            err=errors[0].message
            
        }
       
        
        console.log(err)

    }

    const handling=()=>{
        if(error!=null){
            return(
                <p style={{color:'red'}}>{error}</p>
            )
        }
        else if(ok == true){
            return(
                <p style={{color:'green'}}>You have been logged in successfully</p>
            )
        }
        else{
            return(
                <p></p>
            )
        }
    }
    
    
    return(
<>
<div className={styles.Wrapper}>
 <div className={styles.FormContainer}>
    <form className={styles.Form}onSubmit={handleSubmit}>
        <h1>Sign in</h1>
    <div className={styles.Input}>
        <i><FontAwesomeIcon icon={faUser} /></i>
        <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
    </div>
    <div className={styles.Input}>
        <i><FontAwesomeIcon icon={faLock} /></i>
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
    </div>
    <div>
        {handling()}
    </div>
        <button>Login</button>
    </form>
    <div className={styles.LoginPanel}>
        <div className={styles.PanelContent}>
        <div className={styles.PanelText}>
        <h3>New here?</h3>
        <p>Loren ipsum asd 123d f fasd foedreris</p>
        <button className={styles.PanelBtn}>Sign up</button>
        </div>
        <img src={rocket}alt="none" className={styles.image}/>
        </div>

    </div>
</div>

</div>
</>
    )
}

export default Login