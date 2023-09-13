import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAdminLogin, ILogin, Login } from '../../models/Login';

export const handleLogin = createAsyncThunk(
  "user/loginUser",
  async (inputValue: ILogin) => {
    try {
      console.log("payload", inputValue);
      const response: any = await Login.LoginAdmin(inputValue);
      console.log("hahahah ==>", response);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("token", response.accessToken);
      return response;
    } catch (error) {
      return error
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    isLoggedIn: false,
    token: "",
    error: false,
  },
  reducers: {},
  extraReducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [handleLogin.fulfilled as any]: (state, action: PayloadAction<IAdminLogin>) => {
      state.data = action.payload?.data?.data;
      state.token = action.payload?.data?.accessToken;
      state.isLoggedIn = true;
    },
  },
});


export default userSlice.reducer;
