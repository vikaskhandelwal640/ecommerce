import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firebase from 'firebase/compat/app'; // Change the import path
import 'firebase/compat/auth'; // Change the import path

// Initialize Firebase (Replace these with your Firebase project configuration)
const firebaseConfig = {
  apiKey: "AIzaSyCKsZUCMYEj1CSs_BiAw7dxEcnT0ao31lg",
  authDomain: "clothing-ecommerce-62828.firebaseapp.com",
  projectId: "clothing-ecommerce-62828",
  storageBucket: "clothing-ecommerce-62828.appspot.com",
  messagingSenderId: "465189824458",
  appId: "1:465189824458:web:076bfd0015e35e1bbe1133"
};

// Check if Firebase is not already initialized to prevent multiple initializations
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      // You may want to store additional user data in localStorage or Redux state
      return user;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ firstName, lastName,username, email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      // You may want to store additional user data in localStorage or Redux state
      const UserCredentioal = {
        firstName,
        lastName,
        username,
        email,
      }
      localStorage.setItem("UserCredentioal" , JSON.stringify(UserCredentioal));
      return user;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const logOut = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    pending: false,
    error: false,
    errorMessage: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.pending = true;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.pending = false;
        state.error = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.pending = false;
        state.error = true;
        state.errorMessage = action.payload.error;
      })
      .addCase(registerUser.pending, (state) => {
        state.pending = true;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.pending = false;
        state.error = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.pending = false;
        state.error = true;
        state.errorMessage = action.payload.error;
      })
      .addCase(logOut.pending, (state) => {
        state.pending = true;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(logOut.fulfilled, (state) => {
        state.pending = false;
        state.user = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.pending = false;
        state.error = true;
        state.errorMessage = action.payload.error;
      });
  }
});

export default userSlice.reducer;
