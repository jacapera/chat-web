import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const {
  VITE_URL_POSTMESSAGE,
  VITE_URL_GETCHATSBYUSER,
  VITE_URL_DELETEMESSAGE,
} = import.meta.env;

const initialState = {
  isMinimized: false,
  error:"",
  message:"",
  messages:[],
  activeChatMessages:[],
  selectedUser:{},
  listChats:[],
  scroll: false,
  newChat:false,
}

export const postMessage = createAsyncThunk("app/postMessage", async({formData, token}) => {
  try {
    const { data } = await axios.post(VITE_URL_POSTMESSAGE, formData, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type":'multipart/form-data',
      }
    });
    return data;
  } catch (error) {
    return error.response
  }
});

export const deleteMessage = createAsyncThunk("app/deleteMessage", async({message_id, token}) => {
  try {
    const { data } = await axios.delete(`${VITE_URL_DELETEMESSAGE}/${message_id}`, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return data;
  } catch (error) {
    return error.response;
  }
});

export const listChatsByUser = createAsyncThunk("app/listChatsByUser", async({user_id, token}) => {
  try {
    const { data } = await axios.get(`${VITE_URL_GETCHATSBYUSER}/${user_id}`, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return data;
  } catch (error) {
    console.log("ERROR listChatsByUser: ", error)
    return error.response.data
  }
});

export const getOneChat = createAsyncThunk("app/getOneChat", async({sender_id, receiver_id, token}) => {
  try {
    console.log("sender_id", sender_id, "receiver_id", receiver_id)
    const { data } = await axios.get(`${VITE_URL_GETCHATSBYUSER}/${sender_id}/${receiver_id}`, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return data;
  } catch (error) {
    console.log("ERROR getOneChat: ", error)
    return error.response.data
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
    setScroll: (state, action) => {
      state.scroll = action.payload;
    },
    setNewChat:(state, action) => {
      state.newChat = action.payload;
    }
  },
  extraReducers:(builder) => {
    builder
    .addCase(listChatsByUser.fulfilled, (state, action) => {
      //console.log("ADDCASE ", action.payload)
      if(action.payload.message === "jwt expired"){
        state.error = action.payload.message;
      }
    })
  }
});

export default appSlice.reducer;
export const {
  setIsMinimized, setError, setMessage, setMessages, setScroll, setNewChat,
  setActiveChatMessages, setSelectedUser, setListChats, addMessageToSelectedUser
} = appSlice.actions;
export const selectIsMinimized = (state) => state.app.isMinimized;
export const selectError = (state) => state.app.error;
export const selectMessage = (state) => state.app.message;
export const selectMessages = (state) => state.app.messages;
export const selectActiveChatMessages = (state) => state.app.activeChatMessages;
export const selectSelectedUser = (state) => state.app.selectedUser;