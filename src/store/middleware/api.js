import axios from 'axios';
import * as actions from '../api';

const api = ({ dispatch, getState }) => (next) => async (action) => {
  if (action.type !== actions.API_CALL_BEGAN.type) return next(action);

  const { url, method, onError, onSuccess, data, onStart } = action.payload;
  if (onStart) dispatch({ type: onStart });
  next(action);
  try {
    const response = await axios.request({
      baseURL: 'http://localhost:9001/api',
      url,
      method,
      data,
    });

    // General
    dispatch(actions.API_CALL_SUCCESS(response.data));

    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (err) {
    // General
    dispatch(actions.API_CALL_FAILED(err.message));

    // Specific
    if (onError) dispatch({ type: onError, payload: err });
  }
};

export default api;
