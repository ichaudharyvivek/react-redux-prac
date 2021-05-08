import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { createSelector } from 'reselect';
import { API_CALL_BEGAN } from './api';
// Using createSlice - no need of createActions and createReducers
const slice = createSlice({
  name: 'bugs',
  initialState: {
    list: [],
    isLoading: false,
    lastFetch: null,
  },
  reducers: {
    BUG_REQUESTED: (store, action) => {
      store.isLoading = true;
    },

    BUG_RECEIVED: (store, action) => {
      store.list = action.payload;
      store.isLoading = false;
      store.lastFetch = Date.now();
    },

    BUG_REQUEST_FAILED: (state, action) => {
      state.isLoading = false;
    },

    BUG_ADD: (state, action) => {
      // Note:  We can rename state to any variable like here as bugs
      state.list.push(action.payload);
    },

    BUG_REMOVE: (state, action) => {
      state.list.filter((bug) => bug.id !== action.payload.id);
    },

    BUG_RESOLVE: (state, action) => {
      const bugIndex = state.list.findIndex(
        (bug) => bug.id === action.payload.id
      );
      state.list[bugIndex].resolved = true;
    },

    BUG_ASSIGN_TO_USER: (state, action) => {
      const { id, userId } = action.payload;
      const index = state.list.findIndex((bug) => bug.id === id);
      state.list[index].userId = userId;
    },
  },
});

const {
  BUG_ADD,
  BUG_REMOVE,
  BUG_RESOLVE,
  BUG_RECEIVED,
  BUG_REQUESTED,
  BUG_REQUEST_FAILED,
  BUG_ASSIGN_TO_USER,
} = slice.actions;

// console.log(slice);
export default slice.reducer;

// Action Creators for UI layer abstraction
const url = '/bugs';
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
  if (diffInMinutes < 10) return;

  dispatch(
    API_CALL_BEGAN({
      url: url,
      onStart: BUG_REQUESTED.type,
      onSuccess: BUG_RECEIVED.type,
      onError: BUG_REQUEST_FAILED.type,
    })
  );
};

// IMP: Without Caching - just returns an action creator with type and payload.
// export const loadBugs = () => {
//   return API_CALL_BEGAN({
//     url: url,
//     onStart: BUG_REQUESTED.type,
//     onSuccess: BUG_RECEIVED.type,
//     onError: BUG_REQUEST_FAILED.type,
//   });
// };

// Another API call to Add Bug. User Abstraction in place to avoid any route mismatch
export const addBug = (bug) =>
  API_CALL_BEGAN({
    url,
    method: 'post',
    data: bug,
    onSuccess: BUG_ADD.type,
  });

export const resolveBug = (id) =>
  API_CALL_BEGAN({
    url: `${url}/${id}`,
    method: 'patch',
    data: { resolved: true },
    onSuccess: BUG_RESOLVE.type,
  });

export const assignUser = (bugId, userId) =>
  API_CALL_BEGAN({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { userId },
    onSuccess: BUG_ASSIGN_TO_USER.type,
  });

// Selectors
// export const selectUnresolvedBugs = (state) =>
//   state.entities.bugs.filter((bug) => bug.resolved !== true);

// Selector with Memoization
// Can have multiple selector here (state, bugs)
export const selectUnresolvedBugs = createSelector(
  (state) => state.entities.bugs.list,
  (bugs) => bugs.filter((bug) => !bug.resolved)
);

// export const selectAssignedTo = (state, assignName) => {
//   let totalList = [];
//   state.entities.bugs.forEach((bug) => {
//     if (bug.assignedTo === assignName) totalList.push(bug);
//   });
//   return totalList;
// };

// Using create selector - USES CURRYING
// Here selectAssignedTo returns a function which takes state as initial paramter
export const selectAssignedTo = (assignName) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.assignedTo === assignName)
  );

// // <OR>
// // Simplified using @reduxjs/toolkit
// // Action Types + Creators
// export const bug_add = createAction('BUG_ADD');
// export const bug_remove = createAction('BUG_REMOVE');
// export const bug_resolve = createAction('BUG_RESOLVE');
// // Then define Reducers
// // createReducer(initState, object)
// let lastId = 0; // Track Ids
// export default createReducer([], {
//   // key:value
//   // actions:functions
//   // or we can use [bug_add.type]:fn >>> Hence we do not need to know the property, it loads directly.
//   BUG_ADD: (state, action) => {
//     state.push({
//       id: ++lastId,
//       description: action.payload.description,
//       resolved: false,
//     });
//   },

//   BUG_RESOLVE: (state, action) => {
//     const bugIndex = state.findIndex((bug) => bug.id === action.payload.id);
//     state[bugIndex].resolved = true;
//   },

//   BUG_REMOVE: (state, action) =>
//     state.filter((bug) => bug.id !== action.payload.id),
// });

// // VANILLA REDUX
// // const reducer = (state = [], action) => {
// //   switch (action.type) {
// //     case bug_add.type:
// //       return [
// //         ...state,
// //         {
// //           id: ++lastId,
// //           description: action.payload.description,
// //           resolved: false,
// //         },
// //       ];

// //     case bug_remove.type:

// //     case bug_resolve.type:
// //       return state.map((bug) =>
// //         bug.id !== action.payload.id ? bug : { ...bug, resolved: true }
// //       );

// //     default:
// //       return state;
// //   }
// // };

// // export default reducer;
