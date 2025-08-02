// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Safe localStorage set
const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Safe localStorage get
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Safe localStorage remove
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      
      if(!formData.email.endsWith("@gmail.com")) return rejectWithValue("Invalid Email ID");

      const res = await axios.post(`${API_URL}/auth/register`, formData);
      saveToken(res.data.token);
      return res.data;

    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loadTokenFromStorage = createAsyncThunk(
  'auth/loadToken',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token;
    }
    return null;
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {

      if(!formData.email.endsWith("@gmail.com")) return rejectWithValue("Invalid Email ID");

      const res = await axios.post(`${API_URL}/auth/login`, formData);
      saveToken(res.data.token);
      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Load user using token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (e) {

      if(e.response?.status === 401) return rejectWithValue("Token Expired");
      return rejectWithValue('Failed to fetch user profile',e.message);

    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
