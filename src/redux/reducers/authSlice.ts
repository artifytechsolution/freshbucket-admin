"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// 1. Define Interfaces based on your JSON data
interface User {
  id: string;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  // ... other fields as needed
}

interface AuthState {
  authToken: string | null;
  userData: User | null;
}

const initialState: AuthState = {
  authToken: null,
  userData: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // UPDATED: Handled the nested structure from your API response
    setUser(state, action: PayloadAction<any>) {
      console.log("Setting User Data:", action.payload);
      
      // Check if the payload has the 'userData' wrapper (as seen in your JSON)
      if (action.payload?.userData) {
        // Extract user details
        state.userData = action.payload.userData.user;
        
        // Extract token (Note: using 'acessToken' to match your API spelling)
        if (action.payload.userData.token) {
          state.authToken = action.payload.userData.token.acessToken;
        }
      } else {
        // Fallback if payload is already flat
        state.userData = action.payload;
      }
    },
    removeUser(state) {
      state.userData = null;
      state.authToken = null; // Usually good to clear token on logout too
    },
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.authToken = action.payload;
    },
    removeAuthToken(state) {
      state.authToken = null;
    },
    // Kept these as per your original code, though usually handled by setUser
    setsearchdetails(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    removesearchdetails(state) {
      state.userData = null;
    },
  },
});

export const {
  setUser,
  removeUser,
  setAuthToken,
  removeAuthToken,
  setsearchdetails,
  removesearchdetails,
} = authSlice.actions;

export default authSlice.reducer;

// ------------------------------------------
// CORRECTED SELECTORS
// ------------------------------------------

// Your slice is named 'user', so we access state.user first
export const selectAuthToken = (state: RootState) => {
  // Access: Root -> user slice -> authToken property
  return state?.user?.authToken ?? null;
};

export const selectUser = (state: RootState) => {
  // Access: Root -> user slice -> userData property
  return state?.user?.userData ?? null;
};

// Kept this, but ensure 'app' exists in your RootState if you use it
export const selectSerchdetails = (state: RootState) =>
  state?.user?.userData ?? null;