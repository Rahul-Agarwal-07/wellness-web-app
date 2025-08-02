'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { loadUser } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function ProfilePage() {

  const dispatch = useDispatch();
  const router = useRouter();

  const[name,setName] = useState('User');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getUserProfile();
  },[]);

  const getUserProfile = async() =>
  {
    const resultAction = await dispatch(loadUser());

    if(loadUser.fulfilled.match(resultAction))
    {
        console.log("Profile Fetch Success",resultAction.payload);
        const user = resultAction.payload
        
        if(user)
        {
            setName(`${user.firstName} ${user.lastName}`);
            setEmail(user.email);
        }
    }
    else
    {
        if(resultAction.payload === 'Token Expired') 
        {
            toast.error("Token Expired! Please Re-Login");
            router.push("/auth");
        }

        else
        {
            console.log(resultAction.payload);
            toast.error("Failed to Get Profile")
        }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cover}></div>

      <div className={styles.profileSection}>
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4caf50&color=fff`} alt="Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.email}>{email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}
