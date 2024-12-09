import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../service/api';

export const generateBill = createAsyncThunk(
  'bills/generateBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await API.post('/bills/generate', billData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate bill');
    }
  }
);

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/bills');
      return response.data.data.bills;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bills');
    }
  }
);

export const fetchBillById = createAsyncThunk(
  'bills/fetchBillById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/bills/${id}`);
      return response.data.data.bill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bill');
    }
  }
);

export const fetchTodayIncome = createAsyncThunk(
  'bills/fetchTodayIncome',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/bills/today/income');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s income');
    }
  }
);

export const updateTodayIncome = createAsyncThunk(
  'bills/updateTodayIncome',
  async (income, { rejectWithValue }) => {
    try {
      const response = await API.post('/bills/today/income', { income });
      return response.data.data.income;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update income');
    }
  }
);

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    currentBill: null,
    loading: false,
    error: null,
    todayIncome: 0,
    todayIncomeLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
    setTodayIncome: (state, action) => {
      state.todayIncome = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload.bill;
        state.error = null;
      })
      .addCase(generateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
        state.error = null;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBillById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
        state.error = null;
      })
      .addCase(fetchBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTodayIncome.pending, (state) => {
        state.todayIncomeLoading = true;
      })
      .addCase(fetchTodayIncome.fulfilled, (state, action) => {
        state.todayIncomeLoading = false;
        state.todayIncome = action.payload.income;
        state.error = null;
      })
      .addCase(fetchTodayIncome.rejected, (state, action) => {
        state.todayIncomeLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTodayIncome.pending, (state) => {
        state.todayIncomeLoading = true;
      })
      .addCase(updateTodayIncome.fulfilled, (state, action) => {
        state.todayIncome = action.payload;
        state.todayIncomeLoading = false;
      })
      .addCase(updateTodayIncome.rejected, (state) => {
        state.todayIncomeLoading = false;
      });
  },
});

export const { clearError, clearCurrentBill, setTodayIncome } = billSlice.actions;
export default billSlice.reducer; 