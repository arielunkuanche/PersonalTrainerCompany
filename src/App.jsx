import { useState } from 'react'
import './App.css'
import MainDrawerLeft from './MainDrawerLeft'
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <>
      <MainDrawerLeft />
      <Outlet />
    </>
  )
}

export default App
