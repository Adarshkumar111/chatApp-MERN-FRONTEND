import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currentState, setCurrentState] = useState('Sign up')
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [image, setImage] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    // STEP 1
    if (currentState === "Sign up" && !isDataSubmitted) {

      if (!fullname || !email || !password) {
        return alert("Please fill all fields")
      }

      setIsDataSubmitted(true)
      return
    }

    // STEP 2 → final signup
    if (currentState === "Sign up") {
      login("signup", {
        fullName: fullname,
        email,
        password,
        bio,
        image
      })
    }

    // LOGIN
    if (currentState === "Login") {
      login("login", { email, password })
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>

        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}

          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className='w-5 cursor-pointer'
            />
          )}
        </h2>

        {/* STEP 1 */}

        {currentState === 'Sign up' && !isDataSubmitted && (
          <>
            <input
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              type="text"
              placeholder='Full name'
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
          </>
        )}

        {/* STEP 2 */}

        {currentState === 'Sign up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder='Provide a short Bio...'
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
          />
        )}

        {/* LOGIN */}

        {currentState === "Login" && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
          </>
        )}

        {/* button */}

        <button className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === "Sign up"
            ? (isDataSubmitted ? "Create Account" : "Next")
            : "Login Now"}
        </button>

        {/* terms */}

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        {/* switch */}

        <div className='flex flex-col gap-2'>
          {currentState === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?
              <span
                onClick={() => {
                  setCurrentState("Login")
                  setIsDataSubmitted(false)
                }}
                className='font-medium text-violet-500 cursor-pointer ml-1'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account
              <span
                onClick={() => setCurrentState("Sign up")}
                className='font-medium text-violet-500 cursor-pointer ml-1'
              >
                Click here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage