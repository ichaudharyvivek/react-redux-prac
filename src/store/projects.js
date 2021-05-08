import { createSlice } from '@reduxjs/toolkit';

let lastId = 0;
const slice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    PROJECT_ADD: (state, action) => {
      state.push({
        id: ++lastId,
        description: action.payload.description,
        projectLead: action.payload.projectLead,
        members: action.payload.members,
      });
    },
  },
});

export const { PROJECT_ADD } = slice.actions;
export default slice.reducer;
