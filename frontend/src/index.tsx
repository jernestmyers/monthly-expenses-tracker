import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { MainPageLayout } from './components/Layouts/MainPageLayout';
import { DefaultPageLayout } from './components/Layouts/DefaultPageLayout';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { userRoutes } from './routes/userRoutes';

// MUI defaults to roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainPageLayout>
          <App />
        </MainPageLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/:year',
    element: (
      <PrivateRoute>
        <MainPageLayout>
          <App />
        </MainPageLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/:year/:month',
    element: (
      <PrivateRoute>
        <MainPageLayout>
          <App />
        </MainPageLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <DefaultPageLayout>
        <Login />
      </DefaultPageLayout>
    ),
  },
  // {
  //   path: '/register',
  //   element: <Register />,
  // },
  ...userRoutes,
]);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
