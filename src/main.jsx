import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Customers from './pages/Customers.jsx';
import Trainings from './pages/Trainings.jsx';
import MyCalendar from './pages/MyCalendar.jsx';
import Statistic from './pages/Statistic.jsx';
import Error from './pages/Error.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/customers',
        element: <Customers />,
        index: true
      },
      {
        path: '/trainings',
        element: <Trainings />
      },
      {
        path: '/calendar',
        element: <MyCalendar />
      },
      {
        path: '/statistic',
        element: <Statistic />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
