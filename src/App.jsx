import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import Profilepage from './page/Profilepage'


const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='profile' element={<Profilepage />} />
      </Routes>
    </div>
  )
}

export default App
