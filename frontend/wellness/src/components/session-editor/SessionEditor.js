'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getSessionById, publishSession, saveDraft } from '@/redux/slices/sessionSlice';
import { ClipLoader } from 'react-spinners';

export default function SessionEditor() {

  const dispatch = useDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const { loading } = useSelector((state) => state.session);

  useEffect( async() => {
    if(id) 
    {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fetchSessionById()
    }
  },[id]);

 useEffect(() => {
  const interval = setInterval(() => {
    const autoSaveDraft = async () => {
      setIsAutoSaving(true);

      const resultAction = await dispatch(
        saveDraft({
          _id: id,
          title: title,
          tags: tags,
          jsonFileUrl: jsonUrl,
        })
      );

      if (saveDraft.fulfilled.match(resultAction)) {
        console.log("Autosave successful");
      } else {
        console.error("Autosave failed:", resultAction.payload);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsAutoSaving(false);
    };

    autoSaveDraft();
  }, 30000);

  return () => clearInterval(interval);
}, [title, jsonUrl, tags, id, dispatch]);


  const fetchSessionById = async(e) =>
  {
     const resultAction = await dispatch(getSessionById(id));

     if(getSessionById.fulfilled.match(resultAction))
     {
        console.log("Fetch Session By ID Success",resultAction.payload);
        const session = resultAction.payload;

        setTitle(session.title || '');
        setJsonUrl(session.jsonFileUrl || '');
        setTags(session.tags.join(",") || '');

        console.log(session.tags)
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
          toast.error("Failed to Fetch Sessions")
        }
     }
  }

  const handleSaveDraft = async (flag) => {
    
    const resultAction = await dispatch(saveDraft({_id : id, title : title, tags : tags, jsonFileUrl : jsonUrl}));

    if (saveDraft.fulfilled.match(resultAction)) {

      console.log('Session Saved Success', resultAction.payload);
      router.replace(`/dashboard/session-editor?id=${resultAction.payload.session._id || ''}`)

      if(flag) handlePublish(resultAction.payload.session._id)
      else toast.success("Draft Saved!")

    } else {

      if(resultAction.payload === 'Token Expired') 
      {
        toast.error("Token Expired! Please Re-Login");
        router.push("/auth");
      }

      else
      {
        console.log(resultAction.payload);
        toast.error("Failed to Save Draft")
      }
    }
  };

  const handlePublish = async (sessionId) => {
    
    const resultAction = await dispatch(publishSession({id : sessionId}));

    if (publishSession.fulfilled.match(resultAction)) {
      console.log('Session Publish Success', resultAction.payload);
      toast.success("Session Published Successfully!");
    } else {

      if(resultAction.payload === 'Token Expired') 
      {
        toast.error("Token Expired! Please Re-Login");
        router.push("/auth");
      }

      else
      {
        console.log(resultAction.payload);
        toast.error("Failed to Publish Session")
      }
    }
  };

  return (
    <div className={styles.wrapper}>

      {isAutoSaving && (
      <div className={styles.autosaveStatus}>
        <div className={styles.loader}></div>
        <span>Autosaving...</span>
      </div>
      )}

      {loading && !isAutoSaving && (
        <div className={styles.loaderOverlay}>
          <ClipLoader color="#1af921ff" size={40} />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>{id ? "Edit Session" : "Create Session"}</div>

        <div className={styles.fieldWrapper}>
            <label className={styles.label}>
                Title <span className={styles.required}>*</span>
                </label>
                <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter session title"
            />

            <label className={styles.label}>
                JSON Url <span className={styles.required}>*</span>
                </label>
                <input
                className={styles.input}
                value={jsonUrl}
                onChange={(e) => setJsonUrl(e.target.value)}
                placeholder="Enter JSON Url"
            />

            <label className={styles.label}>Tags (comma separated)</label>
                <input
                className={styles.input}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. yoga, meditation, exercise etc"
            />
        </div>

        <div className={styles.buttonRow}>
        <button
          className={`${styles.button} ${styles.draftButton}`}
          onClick={ () => handleSaveDraft(0) }
          disabled={saving || !title.trim() || !jsonUrl.trim() || loading}
          title={!title.trim() ? 'Title is required' : ''}
        >
          {saving && status === 'draft' ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          className={`${styles.button} ${styles.publishButton}`}
          onClick={ () => {
            handleSaveDraft(1)
          } }
          disabled={saving || !title.trim() || !jsonUrl.trim() || loading }
          title={!title.trim() ? 'Title is required' : ''}
        >
          {saving && status === 'published' ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      </div>
    </div>
  );
}
