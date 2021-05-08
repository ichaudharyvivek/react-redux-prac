import { createAction } from '@reduxjs/toolkit';

export const API_CALL_BEGAN = createAction('api/CALL_BEGAN');
export const API_CALL_SUCCESS = createAction('api/CALL_SUCCESS');
export const API_CALL_FAILED = createAction('api/CALL_FAILED');
