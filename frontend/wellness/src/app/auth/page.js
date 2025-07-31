'use client';

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { loadTokenFromStorage, loginUser, registerUser } from '../../redux/slices/authSlice'
import { useRouter } from 'next/navigation';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AuthScreen() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, user } = useSelector((state) => state.auth)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)


  useEffect(() =>
  {
    dispatch(loadTokenFromStorage());
  },[dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault()
   
    if (!agreed) {
      toast.warn("You must agree to the Terms & Conditions");
      return
    }

    const resultAction = await dispatch(registerUser({ firstName, lastName, email, password }))

    if (registerUser.fulfilled.match(resultAction)) {
      console.log("Registration successful", resultAction.payload)
      router.push('/dashboard')
    } else {
      console.error("Registration failed", resultAction.payload)
      toast.error(resultAction.payload)
    }
  }

  const handleLogin = async(e) =>
  {
    e.preventDefault();

    if(!agreed)
    {
      toast.warn("You must agree to the Terms & Conditions");
      return
    }

    const resultAction = await dispatch(loginUser({email : email, password : password}));
    
    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Login successful", resultAction.payload)
      router.push('/dashboard')
    } else {
      console.error("Login failed", resultAction.payload)
      toast.error(resultAction.payload)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.leftPaneTop}>
          <div className={styles.logo}>App Name</div>
          <button className={styles.backBtn}>Back to website →</button>
        </div>
        
       <div className={styles.leftPaneImg}>
          <img
            src="/auth_screen_img.png"
            alt="Picture"
            style={{ objectFit: 'contain' }}/>
       </div>

       <div className={styles.caption}>Earn Health. Earn Wealth.</div>

      </div>

      <div className={styles.rightPane}>
        <h1 className='font-bold'>{isLogin ? "Sign In" : "Create an account"}</h1>
        <p>{!isLogin ? 'Already have an account? ' : "Don't have an account? "}<a onClick={ () => setIsLogin(!isLogin)} >{isLogin ? "Sign Up" : "Log In"}</a></p>

        <form className={styles.form} onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && <div className={styles.inputGroup}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              className={styles.inputField}
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>}

          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.passwordWrapper}>
            <input
              className={styles.inputField}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FontAwesomeIcon 
              icon={showPassword ? faEye : faEyeSlash}
              onClick = {() => setShowPassword(!showPassword)} 
              className={styles.eye}
            />

          </div>

          <label className={styles.checkboxLabel}>
            <input
            color='lightgreen'
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <div>
              <span>I agree to the </span>
              <a href="#">Terms & Conditions</a>
            </div>
          </label>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {isLogin ? (loading ? "Signing You in..." : "Sign In") : (loading ? "Creating account..." : "Create account")}
          </button>
        </form>

        <div className={styles.orLine}>
          <hr /><span>Or {isLogin ? "Sign In" : "Sign Up"} with</span><hr />
        </div>

        <div className={styles.socialButtons}>
          <button 
            onClick={() => toast.error("Haven't Enabled Yet")}
            className={styles.googleBtn}>
            <Image 
              src = '/google_icon.png'
              width={24}
              height={24}
              style={{objectFit:'contain'}}
              alt='Google Icon'
            />
            Google
            </button>
          <button 
            onClick={() => toast.error("Haven't Enabled Yet")}
            className={styles.facebookBtn}>
            <Image 
              src = '/facebook_icon.png'
              width={24}
              height={24}
              style={{objectFit:'contain'}}
              alt='Facebook Icon'
            />
            Facebook
            </button>
        </div>
      </div>
    </div>
  )
}
