import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
  showSidebar: boolean;
  filterTransaction: boolean;
  filterTeleAnchor: boolean;
  filterTeleConsulting: boolean;
}

const initialState: initialStateProps = {
  showSidebar: true,
  filterTransaction: false,
  filterTeleAnchor: false,
  filterTeleConsulting: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    toggleSidebar(state, action) {
      const toggle = action.payload;
      state.showSidebar = toggle;
    },
    toggleFilterTransaction(state, action) {
      const toggle = action.payload;
      state.filterTransaction = toggle;
    },
    toggleFilterTeleAnchor(state, action) {
      const toggle = action.payload;
      state.filterTeleAnchor = toggle;
    },
    toggleFilterTeleConsulting(state, action) {
      const toggle = action.payload;
      state.filterTeleConsulting = toggle;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
