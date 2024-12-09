import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/slices/authSlice';
import productReducer from './redux/slices/productSlice';
import billReducer from './redux/slices/billSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    bills: billReducer,
  }
});

export default store;
