import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk("getUser", async () =>{
    try {
        // console.log("auth called")
        const res = await fetch(`http://localhost:5000/datafetch`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          credentials: "include",
        });
  
        if (!res.status === 200) {
        //   throw new Error(res.error);
            return res.error
        }
        return  await res.json();
        // console.log("from the checking component==>",data);
  
  
  
      } catch (err) {
        console.log(err);
        return err
      //   history.push('/');
      }
})


const getAuthSlice = createSlice({
    name: "auth",
    initialState:{
        loading: false,
        user: [],
        error:''
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(getUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
          })
          .addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // You can set the error message from the action payload.
          });
      },
})

export default  getAuthSlice.reducer
// export const { } = getAuthSlice.actions