import { useState } from 'react'
import './App.css'
import MainDrawerLeft from './MainDrawerLeft'
import { Outlet } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function App() {

  return (
    <>
      <MainDrawerLeft />
      <Outlet />
    </>
  )
}

export default App
