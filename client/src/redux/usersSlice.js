import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id:"",
  userName:"",
  image:"",
  token:"",
  access:false,
  allUsers:[],
}

const usersSlice = createSlice({
  name:"users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {user_id, userName, image, token, access } = action.payload;
      state.user_id = user_id;
      state.userName = userName;
      state.image = image;
      state.token = token;
      state.access = access;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    }
  }
});

export default usersSlice.reducer;
export const { setUser, setAllUsers } = usersSlice.actions;
export const selectAllUsers = (state) => state.users.allUsers;