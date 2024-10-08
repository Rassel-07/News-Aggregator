import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';

import Layout from './components/Layout';
import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import PostDetail from "./pages/PostDetail"
import Register from "./pages/Register"
import Login from "./pages/Login"
import UserProfile from './pages/UserProfile';
import CreatePosts from './pages/CreatePosts';
import EditPost from "./pages/EditPost"
import DeletePost from "./pages/DeletePost"
import CategoryPosts from "./pages/CategoryPosts"
import AuthorPosts from "./pages/AuthorPosts"
import Dashboard from "./pages/Dashboard"
import Logout from "./pages/Logout"
import UserProvider from './context/userContext';


const router = createBrowserRouter([
  {
    path:"/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children:[
      {index:true,element:<Home/> },
      {path:"posts/:id",element:<PostDetail/> },
      {path:"register",element:<Register/> },
      {path:"login",element:<Login/> },
      {path:"profile/:id",element:<UserProfile/> },
      {path:"create",element:<CreatePosts/> },
      {path:"posts/category/:category",element:<CategoryPosts/> },
      {path:"posts/users/:id",element:<AuthorPosts/> },
      {path:"myposts/:id",element:<Dashboard/> },
      {path:"posts/:id/edit",element:<EditPost/> },
      {path:"posts/:id/delete",element:<DeletePost/> },
      {path:"logout",element:<Logout/> },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
  <RouterProvider router={router}/>
</React.StrictMode>
    

);


