import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const { VITE_URL_POSTMESSAGE } = import.meta.env;

const initialState = {
  isMinimized: false,
  error:"",
  message:"",
  messages:[],
  activeChatMessages:[],
  selectedUser:{},
  listChats:[],
}

export const postMessage = createAsyncThunk("app/postMessage", async(sender_id, receiver_id, content) => {
  try {
    const { data } = await axios.post(VITE_URL_POSTMESSAGE, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return data;
  } catch (error) {
    return error.response
  }
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsMinimized: (state, action) => {
      state.isMinimized = action.payload;;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setActiveChatMessages: (state, action) => {
      state.activeChatMessages = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setListChats: (state, action) => {
      state.listChats = action.payload;
    },
    addMessageToSelectedUser: (state, action) => {
      state.selectedUser?.Messages.push(action.payload);
    },
  }
});

export default appSlice.reducer;
export const {
  setIsMinimized, setError, setMessage, setMessages,
  setActiveChatMessages, setSelectedUser, setListChats, addMessageToSelectedUser
} = appSlice.actions;
export const selectIsMinimized = (state) => state.app.isMinimized;
export const selectError = (state) => state.app.error;
export const selectMessage = (state) => state.app.message;
export const selectMessages = (state) => state.app.messages;
export const selectActiveChatMessages = (state) => state.app.activeChatMessages;
export const selectSelectedUser = (state) => state.app.selectedUser;