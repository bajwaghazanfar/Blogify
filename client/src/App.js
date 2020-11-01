import React from 'react';
import Createblog from './components/CreateBlog/Createblog'
import Homepage from './components/Homepage/Homepage'
import Navigation from './components/Navbar/Navbar'
import{BrowserRouter as Router,Route,Link,Switch}from 'react-router-dom'
import styles from './App.module.css'
import BlogPage from './components/BlogPage/BlogPage'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import {useHistory,Redirect}from 'react-router-dom'
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import ProfilePage from './components/ProfilePage/ProfilePage';
import Search from './components/SearchPage/Search'
import GetUserPage from './components/getUserPage/getUserPage'
import EditBlog from './components/EditBlog/editBlog'
import EditProfile from './components/editProfile/EditProfile'


function App() {

  
  

  const token = localStorage.getItem('accessToken')
  return (
<div className={styles.wrapper}>
    <Router>
      <Switch>
      <Route exact path="/">
        {token == null  ? <Redirect to="/login" /> : <Homepage />}
      </Route>
      <Route  path="/create">
        {token == null  ? <Redirect to="/login" /> : <Createblog />}
      </Route>
      <Route path="/login"component={Login}/>
      <Route path="/blogs"component={BlogPage}/> 
      <Route path="/register"component={Register}/>
      <Route path="/profile"component={ProfilePage}>
      {token == null  ? <Redirect to="/login" /> : <ProfilePage />}
      </Route>
      <Route path="/search"component={Search}>
      {token == null  ? <Redirect to="/login" /> : <Search />}
      </Route>
      <Route path="/user"component={GetUserPage}>
      {token == null  ? <Redirect to="/login" /> : <GetUserPage />}
      </Route>
      <Route path="/editBlog"component={EditBlog}>
      {token == null  ? <Redirect to="/login" /> : <EditBlog />}
      </Route>
      <Route path="/editProfile"component={EditProfile}>
      {token == null  ? <Redirect to="/login" /> : <EditProfile />}
      </Route>
      </Switch>
    </Router>
</div>
  );
}

export default App;
