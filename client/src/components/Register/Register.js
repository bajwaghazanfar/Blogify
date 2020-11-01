import React,{useState} from 'react'
import styles from './Register.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons';
import {  faLock } from '@fortawesome/free-solid-svg-icons';
import {  faEnvelope } from '@fortawesome/free-solid-svg-icons';
import desk from './desk.svg'
import gql from 'graphql-tag'
import { useMutation , useQuery } from "@apollo/react-hooks";
import {Redirect,useHistory} from 'react-router-dom'

const RegisterMutation=gql`

    mutation($name:String!,$email:String!,$password:String!){
        addUser(name:$name,email:$email,password:$password){
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

const Register=()=>{
    const[Username,setUserName]=useState('')
    const[Email,setEmail]=useState('')
    const[Password,setPassword]=useState('')

    const[error,setError]=useState(null)
    const [ok,setOk]=useState(false)
    const[addUser]=useMutation(RegisterMutation)
    

    const history=useHistory()
    let err;
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const response= await addUser({
            variables:{
                name:Username,
                email:Email,
                password:Password
            }
        })
        const {accessToken,refreshToken,ok,errors}=response.data.addUser
        console.log(response.data.addUser)
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
            <form className={styles.Form} onSubmit={handleSubmit}>
                <h1>Sign up</h1>
            <div className={styles.Input}>
                <i><FontAwesomeIcon icon={faUser} /></i>
                <input type="text" placeholder="Username" onChange={(e)=>setUserName(e.target.value)} required={true} />
            </div>
            <div className={styles.Input}>
                <i><FontAwesomeIcon icon={faEnvelope} /></i>
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required={true} />
            </div>
            <div className={styles.Input}>
                <i><FontAwesomeIcon icon={faLock} /></i>
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}  required={true}/>
            </div>
            <div>
                {handling()}
            </div>
                <button>Register</button>
            </form>
            <div className={styles.RegisterPanel}>
        <div className={styles.PanelContent}>
        <div className={styles.PanelText}>
        <h3>Already have an account?</h3>
        <p>Loren ipsum asd 123d f fasd foedreris</p>
        <button className={styles.PanelBtn}>Log in</button>
        </div>
        <img src={desk}alt="none" className={styles.image}/>
        </div>

    </div>
            </div>
        </div>
        </>
            )
}
export default Register