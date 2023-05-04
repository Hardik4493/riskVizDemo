import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice( {
    name : "Data",
    initialState : {
        data: [],
        allData: [],
        mapData: [],
        selectedData : null
    },
    reducers : {
        yearData : ( state, action) => {
            state.data = action.payload;
        },
        allData : ( state, action) => {
            state.allData = action.payload;
        },
        mapData : ( state, action) => {
            state.mapData = action.payload
        },
        setSelectedData : (state, action) => {
            state.selectedData = action.payload;
        }
    }
});

export const {
    yearData,
    allData,
    mapData,
    setSelectedData
} = configSlice.actions;

export default configSlice.reducer;