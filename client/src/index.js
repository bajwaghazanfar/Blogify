
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from "@apollo/react-hooks";   
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat,from } from '@apollo/client'
import {createUploadLink}from 'apollo-upload-client'
import React, { createContext, useState } from "react";


const httpLink=createUploadLink({uri:"/graphql"})

let tokenError;

  export const UserContext = createContext();

const UserProvider=(props)=>{

  return(
    <UserContext.Provider value={[tokenError]}>
      {props.children}
    </UserContext.Provider>
  )
  
}




const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const accessToken=localStorage.getItem('accessToken')
  const refreshToken=localStorage.getItem('refreshToken')

  operation.setContext({
    headers: {
      accessToken:accessToken?accessToken:"",
      refreshToken:refreshToken?refreshToken:"",
    }
  });

  return forward(operation)
})

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext()
    const {
      response: { headers }
    } = context

    if (headers){
      const newAccessToken=headers.get('accessToken')
      const err=headers.get('error')
      if(newAccessToken){
        localStorage.setItem('accessToken',newAccessToken)
      }
      if(err){
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        tokenError=err
        console.log(tokenError)
      }else{
        tokenError=null
      }


    }

    return response
  })
})


const client=new ApolloClient({
  link: from([authMiddleware,afterwareLink,httpLink]),   
  cache:new InMemoryCache()
})


ReactDOM.render(
<ApolloProvider client={client}>
  <UserProvider>
    <App />
  </UserProvider>
</ApolloProvider>,
  document.getElementById('root')
);
