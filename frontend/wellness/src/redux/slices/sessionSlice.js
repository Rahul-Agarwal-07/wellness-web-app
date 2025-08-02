import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:5000/api'

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getPublicSessions = createAsyncThunk(
    'sessions/public',
    async(_, {rejectWithValue}) =>
    {
        try
        {
            const delay = () => new Promise(res => setTimeout(res, 1000));
            const [res] = await Promise.all([
                axios.get(`${API_URL}/sessions`),
                delay()
            ]);

            return res.data;
        }
        catch(e)
        {
            return rejectWithValue("Failed to Public Sessions Data", e.message);
        }
    }
)


export const getUserSessions = createAsyncThunk(
    'sessions/user-sessions',
    async(_, {rejectWithValue}) =>
    {
        try
        {
            const token = getToken();
            const delay = () => new Promise(res => setTimeout(res, 1000));
            const [res] = await Promise.all([
                axios.get(`${API_URL}/my-sessions`, {
                    headers : { Authorization: `Bearer ${token}`}
                }),
                delay()
            ]);

            return res.data;
        }
        catch(e)
        {
            if(e.response?.status === 401) return rejectWithValue("Token Expired");
            return rejectWithValue("Failed to Fetch User Sessions due to ",e.message);
        }
    }
)

export const getSessionById = createAsyncThunk(
    'sessions/:id',
    async(id, {rejectWithValue}) =>
    {
        try
        {
            const token = getToken();
            const [res] = await Promise.all([
                axios.get(`${API_URL}/my-sessions/${id}`, {
                    headers : { Authorization: `Bearer ${token}`}
                }),
            ]);

            return res.data;
        }
        catch(e)
        {
            if(e.response?.status === 401) return rejectWithValue("Token Expired");
            return rejectWithValue("Failed to Fetch Session due to ",e.message);
        }
    }
)

export const saveDraft = createAsyncThunk(
    'sessions/save-draft',
    async(sessionData, {rejectWithValue}) =>
    {
        try
        {
            const token = getToken();
            const [res] = await Promise.all([
                axios.post(`${API_URL}/my-sessions/save-draft`, sessionData, {
                    headers : { Authorization: `Bearer ${token}`, },
                }),
            ]);

            return res.data;
        }
        catch(e)
        {
            if(e.response?.status === 401) return rejectWithValue("Token Expired");
            return rejectWithValue("Failed to Save Session Draft due to ",e.message);
        }
    }
)

export const publishSession = createAsyncThunk(
    'sessions/publish',
    async(sessionData, {rejectWithValue}) =>
    {
        try
        {
            const token = getToken();
            const [res] = await Promise.all([
                axios.post(`${API_URL}/my-sessions/publish`, sessionData, {
                    headers : { Authorization: `Bearer ${token}`, },
                }),
            ]);

            return res.data;
        }
        catch(e)
        {
            if(e.response?.status === 401) return rejectWithValue("Token Expired");
            return rejectWithValue("Failed to Publish Session due to ",e.message);
        }
    }
);

export const deleteSession = createAsyncThunk(
    'sessions/delete',
    async(id, {rejectWithValue}) =>
    {
        try
        {
            const token = getToken();
            const [res] = await Promise.all([
                axios.delete(`${API_URL}/my-sessions/${id}`, {
                    headers : { Authorization: `Bearer ${token}`, },
                }),
            ]);

            return res.data;
        }
        catch(e)
        {
            if(e.response?.status === 401) return rejectWithValue("Token Expired");
            return rejectWithValue("Failed to Publish Session due to ",e.message);
        }
    }
)

const sessionSlice = createSlice({
    name : 'sessions',
    initialState : {
        sessions : null,
        token : null,
        loading : false,
        error : null,
    },
    extraReducers : (builder) =>
    {
        builder
            .addCase(getPublicSessions.pending, (state,action) =>
            {
                state.loading = true;
            })
            .addCase(getPublicSessions.fulfilled, (state,action) =>
            {
                state.sessions = action.payload;
                state.loading = false;
            })
            .addCase(getPublicSessions.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getUserSessions.pending, (state,action) =>
            {
                state.loading = true;
            })
            .addCase(getUserSessions.fulfilled, (state,action) =>
            {
                state.sessions = action.payload;
                state.loading = false;
            })
            .addCase(getUserSessions.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSessionById.pending, (state,action) =>
            {
                state.loading = true;
            })
            .addCase(getSessionById.fulfilled, (state,action) =>
            {
                state.sessions = action.payload;
                state.loading = false;
            })
            .addCase(getSessionById.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(saveDraft.pending, (state,action) =>
            {
                state.loading = true;
            })
            .addCase(saveDraft.fulfilled, (state,action) =>
            {
                state.loading = false;
            })
            .addCase(saveDraft.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteSession.pending, (state,action) =>
            {
                state.loading = true;
            })
            .addCase(deleteSession.fulfilled, (state,action) =>
            {
                state.loading = false;
            })
            .addCase(deleteSession.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default sessionSlice.reducer;