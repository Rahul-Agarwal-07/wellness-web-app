'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { FiUser, FiPlus, FiHome, FiDelete, FiTrash } from 'react-icons/fi';
import { FaChalkboardTeacher, FaTrash, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteSession, getPublicSessions, getUserSession, getUserSessions } from '@/redux/slices/sessionSlice';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { loadUser } from '@/redux/slices/authSlice';

export default function WellnessDashboard() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get loading & error state from Redux
  const { loading, error } = useSelector((state) => state.session);

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState('dashboard');
  const [name,setName] = useState('User')
  
  const fetchPublicSessions = async () => {
    
    const resultAction = await dispatch(getPublicSessions());

    if (getPublicSessions.fulfilled.match(resultAction)) {
      console.log('Fetch Public Session Success', resultAction.payload);
      setSessions(resultAction.payload);
    } else {
      console.log(resultAction.payload);
      toast.error("Failed to Fetch Sessions");
    }
  };

  const fetchUserSessions = async () => {
    
    const resultAction = await dispatch(getUserSessions());

    if (getUserSessions.fulfilled.match(resultAction)) {
      console.log('Fetch User Session Success', resultAction.payload);
      setSessions(resultAction.payload);
    } else {

      if(resultAction.payload === 'Token Expired') 
      {
        toast.error("Token Expired! Please Re-Login");
        router.push("/auth");
      }

      else
      {
        console.log(resultAction.payload);
        toast.error("Failed to Fetch Sessions")
      }
    }
  };

  const handleDelete = async(e,sessionId) => 
  {
     e.stopPropagation()

     const resultAction = await dispatch(deleteSession(sessionId));

    if (deleteSession.fulfilled.match(resultAction)) {
      console.log('Session Delete Success', resultAction.payload);
      fetchUserSessions();
      toast.success("Session Deleted Successfully!");
    } else {

      if(resultAction.payload === 'Token Expired') 
      {
        toast.error("Token Expired! Please Re-Login");
        router.push("/auth");
      }

      else
      {
        console.log(resultAction.payload);
        toast.error("Failed to Delete Session")
      }
    }
  }

  const getUserProfile = async() =>
  {
    const resultAction = await dispatch(loadUser());

    if(loadUser.fulfilled.match(resultAction))
    {
        console.log("Profile Fetch Success",resultAction.payload);
        const user = resultAction.payload
        
        if(user)
        {
            setName(`${user.firstName}`);
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

  const handleNavClick = (viewName) => {
    router.replace(`?view=${viewName}`, { scroll: false });
  };

  const handleSessionClick = (id) => 
  {
     if(activeSession !== 'dashboard')
        router.push(`/dashboard/session-editor?id=${id}`)
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  
  useEffect(() => {
    const urlView = searchParams.get('view') || 'dashboard';
    if (urlView !== activeSession) {
        setActiveSession(urlView);
    }
  }, [searchParams, activeSession]);


  useEffect(() => {
    if (activeSession === 'dashboard') {
      fetchPublicSessions();
    } else {
      fetchUserSessions();
    }
  }, [activeSession, dispatch]);


  return (
    <div className={styles.dashboardContainer}>
      
      {loading && (
        <div className={styles.loaderOverlay}>
          <ClipLoader color="#1af921ff" size={40} />
        </div>
      )}

      <div className={styles.sidebar}>

        <div onClick={() => router.replace('/')} className={styles.logo}>WellNest</div>

        <nav className={styles.navLinks}>

          <button className={styles.navLink} onClick={ () => handleNavClick('dashboard') }>
            <FiHome className={styles.navIcon} /> <span>Dashboard</span>
          </button>
          
          <button className={styles.navLink} onClick={ () => handleNavClick('my-sessions') }>
            <FaChalkboardTeacher className={styles.navIcon} /> <span>Sessions</span>
          </button>

          <Link href="/profile" className={styles.navLink}>
            <FiUser className={styles.navIcon} /> <span>Profile</span>
          </Link>
        </nav>

      </div>

      <div className={styles.mainContent}>

        <div className={styles.header}>

          <div className={styles.dashboardHeader}>
            {activeSession === 'dashboard' && <span className={styles.dashboardTitle}>{`Welcome, ${name}`}</span>}
            <span className={styles.dashboardTitle}>{activeSession === 'dashboard' ? "Dashboard" : "My Sessions"}</span>
          </div>

          <button onClick={() => router.push(`/dashboard/session-editor`)}className={styles.sessionButton}>
            <FiPlus className={styles.icon} />Session
          </button>
        </div>

        <div className={styles.sessionsGrid}>

          {sessions.map((session) => (
            <div key={session._id || session.title} className={styles.sessionCard} onClick={() => handleSessionClick(session._id) }>
              <div className={styles.sessionCardContainer}>
                <div className={styles.sessionHeader}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                {activeSession !== 'dashboard' && <FiTrash onClick= {(e) => handleDelete(e,session._id) } className={`${styles.icon} ${styles.deleteIcon}`}/>}
              </div>

              <div className={styles.sessionBody}>
                <div className={styles.tagContainer}>
                  {session.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

              <div className={styles.sessionFooter}>
                <Link
                  href={session.jsonFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sessionLink}
                  onClick={(e) => e.stopPropagation() }
                >
                  View JSON ↗
                </Link>
              </div>

            </div>

          ))}

        </div>
      </div>
    </div>
  );
}
