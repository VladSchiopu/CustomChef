import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { ProfileState } from "./profileSlice.types";

/**
 * Use constants to identify keys in the local storage. 
 */
const tokenKey = "token";

/**
 * This decodes the JWT token and returns the profile.
 */
const decodeToken = (token: string | null): ProfileState => {
  let decoded = token !== null ? jwtDecode<{ sub: string, roles: [string], iat: number, iss: string, exp: number }>(token) : null;
  const now = Date.now() / 1000;

  if (decoded?.exp && decoded.exp < now) {
    decoded = null;
    token = null;
    localStorage.removeItem(tokenKey);
  }

  return {
    loggedIn: token !== null,
    token: token ?? null,
    name: decoded?.sub ?? null,
    roles: decoded?.roles ?? null,
    iat: decoded?.iat ?? null,
    iss: decoded?.iss ?? null,
    exp: decoded?.exp ?? null
  };
};

/**
 * The reducer needs a initial state to avoid non-determinism.
 */
const getInitialState = (): ProfileState => decodeToken(localStorage.getItem(tokenKey)); // The initial state doesn't need to come from the local storage but here it is necessary to persist the JWT token.

/** 
 * The Redux slice is a sub-state of the entire Redux state, Redux works as a state machine and the slices are subdivisions of it for better management. 
 */
export const profileSlice = createSlice({
  name: "profile", // The name of the slice has to be unique.
  initialState: getInitialState(), // Add the initial state
  reducers: {
    setToken: (_, action: PayloadAction<string>) => { // The payload is a wrapper to encapsulate the data sent via dispatch. Here the token is received, saved and a new state is created.    
      localStorage.setItem(tokenKey, action.payload);

      return decodeToken(action.payload); // You can either return a new state or change it via the first parameter that is the current state.
    },
    resetProfile: () => { // This removes the token from the storage and resets the state.
      localStorage.removeItem(tokenKey);

      return {
        loggedIn: false,
        token: null,
        name: null,
        roles: null,
        iat: null,
        iss: null,
        exp: null
      };
    }
  }
});

export const { 
  setToken,
  resetProfile
} = profileSlice.actions; // Export the slice actions, they are used to wrap the data that is send via the dispatch function to the reducer.

export const profileReducer = profileSlice.reducer; // Export the reducer.
