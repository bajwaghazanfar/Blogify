import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import gql from 'graphql-tag'
import { Editor } from '@tinymce/tinymce-react';
import {useMutation} from '@apollo/react-hooks'
import {blogQuery}from '../Homepage/Homepage'
import styles from './Createblog.module.css'
import { useHistory } from "react-router"
import Navbar from '../Navbar/Navbar'
import MuiAlert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide';







const addMutation=gql`
    mutation($title:String!,$body:String,$file:Upload,$token:String!,$images:[Upload],$summary:String!){
        addBlog(title:$title,body:$body,file:$file,token:$token,images:$images,summary:$summary)
    }

`


const Createblog=()=>{
    const[addBlog]=useMutation(addMutation,{refetchQueries:[{query:blogQuery}]})
    const[Title,setTitle]=useState('')
    const[Body,setBody]=useState('')
    const[File,setFile]=useState([])
    const[Images,setImages]=useState([])
    const[initEditor,setEditor]=useState(null)
    const[Summary,setSummary]=useState('')
    const[open,setOpen]=useState(false)
    const[showError,setError]=useState(undefined)
    const[Submit,setSubmit]=useState('')
    const[ErrorMessage,setErrorMessage]=useState('')
    
    
    

    

  
    const token=localStorage.getItem('accessToken')
    const history=useHistory()

    if(!token){
        history.push('/login')
    }
    

    const onDrop = useCallback(([file]) => {
        setFile(file)
        console.log(file)
      }, [addBlog])

      const{getRootProps,getInputProps,isDragActive}=useDropzone({onDrop})

      const formSubmit=async e=>{
          
          e.preventDefault()
          console.log(Title)
          const response=await addBlog({
              variables:{
                  title:Title,
                  body:Body,
                  file:File,
                  token:localStorage.getItem('accessToken'),
                  images:Images,
                  summary:Summary
              }
              
          })
          if(response.data.addBlog!=false){
            setOpen(true)
            setTimeout(()=>{
              history.push('/')
            },2000) 
          }else{
              console.log()
          }
         

      }
      
      const Alert=(props)=>{
          return <MuiAlert elevation={6} variant="filled"{...props}/>
      }

      const TransitionLeft=(props)=>{
        return <Slide {...props} direction="left" />;
      }
      
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
      const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setError(false);
      };




const handleClick=(e)=>{
  if(Body.length>=150){
    setSubmit('submit')
    setError(false)
    return true
  }
  if(Body.length<150){
    e.preventDefault()
    setError(true)
    setErrorMessage('Blog must be 150 characters or more!')
    setSubmit('')
    return false
  }
}
    


    return(
        
    <div className={styles.cover}>

        
        <Navbar/> 
        
        <form onSubmit={formSubmit} className={styles.form}>
        <h2 >Publish New Blog</h2>
        
            
            <input placeholder="Enter a title"  onChange={(e)=>setTitle(e.target.value)} required={true} />
            <div style={{height:'10px'}}></div>
            <input placeholder="Enter a Summary for your blog" min="10" max="50" onChange={(e)=>setSummary(e.target.value)} required={true} max="30"/>
            <input id="my-file" type="file" name="my-file" style={{display:"none"}} accept="image/*" />
        
            <Editor
           
            
         initialValue="<p>This is the initial content of the editor</p>"
         apiKey="dbgg3gszdp2v4tnd6x9l5v6m5z9vmc9oy6ci7pj109nppsru"
         onEditorChange={(content)=>{setBody(content)}}
         onInit={(editor)=>{setEditor(editor)}}
         init={{
           height: 500,
           menubar: 'tools insert',
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount code codesample image'
             
           ],
           toolbar:
             'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help code codesample forecolor backcolor insertdatetime image',

             custom_colors: false,
             

             image_title: true,
             automatic_uploads: true,
             file_browser_callback_types: 'image',
             file_picker_callback: (callback, value, meta)=>{
                //console.log(window.tinyMCE.activeEditor.insertContent)
               
                
               if (meta.filetype == 'image') {
                   let input = document.getElementById('my-file');
                
                   input.onchange = function () {
                    
                       let file = input.files[0];
                       let reader = new FileReader();
                      
                       reader.onload = function (e) {
                            

                            callback(e.target.result, {
                                title:file.name,
                                alt:file.name
                              
                                
                            });
                            
                        console.log(file)
                           
                       };
                       if(file){
                        setImages(img=>[...img,file])
                        console.log(file)
                        reader.readAsDataURL(file)
                       }
                   };
                   
                   
                   
                   input.click();
               }
           },
           paste_data_images: true,
             

         }}
       />
       
    <div className={styles.DropzoneWrapper}>
       <div {...getRootProps()} className={styles.Dropzone}>
          <input {...getInputProps()} accept="image/*,video/*" />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Enter a cover photo to invite readers to your blog..</p>
      }
      
    </div>
    </div> 
    <Snackbar 
    anchorOrigin={{ vertical:'top', horizontal:'right' }}
    open={open} 
    autoHideDuration={6000} 
    onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Your blog has been published successfully!
        </Alert>
        
 </Snackbar>

 <Snackbar 
    anchorOrigin={{ vertical:'top', horizontal:'right' }}
    open={showError} 
    autoHideDuration={6000} 
    
    onClose={handleErrorClose}>
      
        <Alert onClose={handleErrorClose} severity="error">
          {ErrorMessage}
        </Alert>
        
 </Snackbar>
    
        <Button variant="contained"type={Submit} color="primary" style={{marginTop:'15px'}} onClick={(e)=>{handleClick(e)}} > Publish</Button>
        </form>
        </div>
        
    )


}

export default Createblog
 