import React, { useEffect } from 'react';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Redux Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } = usersSlice.actions;

// fetching data
const fetchUsers = () => async (dispatch) => {
  dispatch(fetchUsersStart());
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    dispatch(fetchUsersSuccess(response.data));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};

// Configure Redux Store
const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
});

// App Component
function App() {
  const dispatch = useDispatch();
  const { data: users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Render App with Redux Provider
function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default Root;
