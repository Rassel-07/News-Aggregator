import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import UserProvider from './context/userContext';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Discover from './pages/Discover';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import StoryOverview from './pages/StoryOverview';
import UserProfile from './pages/UserProfile';
import SettingsPage from './pages/SettingsPage';
import AttributionPage from './pages/AttributionPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'discover', element: <Discover /> },
      { path: 'category/:category', element: <CategoryPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'story/:id', element: <StoryOverview /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'sources', element: <AttributionPage /> },
      { path: 'attribution', element: <AttributionPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
