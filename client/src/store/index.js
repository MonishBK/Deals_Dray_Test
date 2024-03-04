import { configureStore } from "@reduxjs/toolkit";

import getAuthSlice from "./slices/auth";
import employeeDataSlice from "./slices/EmployeeDataSlice";


const store = configureStore({
    reducer: {
        userAuth: getAuthSlice,
        employeeData: employeeDataSlice,
    },
    devTools: false,  
})

export default store;