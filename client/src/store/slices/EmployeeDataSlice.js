import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getEmployee = createAsyncThunk("EmployeeData", async () =>{
    try {
        // console.log("Employee data called")
        const res = await fetch("http://localhost:5000/employee-list-data", {
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
        
        return await res.json();
        // console.log(data)
        // console.log("from the checking component==>",data);
  
  
  
      } catch (err) {
        console.log("error => ",err);
        return err
      //   history.push('/');
      }
})

const employeeDataSlice = createSlice({
    name: "EmployeeData",
    initialState: {
        loading: false,
        data:[],
        error:''
        },

    extraReducers: (builder) => {
        builder
          .addCase(getEmployee.pending, (state) => {
            state.loading = true;
          })
          .addCase(getEmployee.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(getEmployee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
      },

})

// console.log(shoppingLedgerSlice.actions);

export default  employeeDataSlice.reducer

// export const { } = shoppingLedgerSlice.actions