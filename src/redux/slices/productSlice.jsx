import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../service/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products');
      return response.data.data.products || response.data.data || response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await API.post('/products', productData);
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/products/${id}`, data);
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      return id;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue('Product not found');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchInventoryValue = createAsyncThunk(
  'products/fetchInventoryValue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/inventory/total');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory value');
    }
  }
);

export const fetchCategoryWiseValue = createAsyncThunk(
  'products/fetchCategoryWiseValue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/category-wise-value');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category-wise value');
    }
  }
);

export const fetchIncomeStats = createAsyncThunk(
  'products/fetchIncomeStats',
  async (period = 'daily', { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/inventory/income-stats?period=${period}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch income statistics');
    }
  }
);

export const fetchDailyIncomeStats = createAsyncThunk(
  'products/fetchDailyIncomeStats',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/daily-income?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily income statistics');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    success: false,
    currentProduct: null,
    inventorySummary: null,
    categoryWiseValue: null,
    incomeStats: null,
    incomeStatsLoading: false,
    dailyIncomeStats: null,
    dailyIncomeLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.success = true;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Inventory value
      .addCase(fetchInventoryValue.fulfilled, (state, action) => {
        state.inventorySummary = action.payload;
      })
      .addCase(fetchInventoryValue.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Category-wise value
      .addCase(fetchCategoryWiseValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryWiseValue.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryWiseValue = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryWiseValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Income stats
      .addCase(fetchIncomeStats.pending, (state) => {
        state.incomeStatsLoading = true;
      })
      .addCase(fetchIncomeStats.fulfilled, (state, action) => {
        state.incomeStatsLoading = false;
        state.incomeStats = action.payload;
      })
      .addCase(fetchIncomeStats.rejected, (state, action) => {
        state.incomeStatsLoading = false;
        state.error = action.payload;
      })

      // Daily income stats
      .addCase(fetchDailyIncomeStats.pending, (state) => {
        state.dailyIncomeLoading = true;
      })
      .addCase(fetchDailyIncomeStats.fulfilled, (state, action) => {
        state.dailyIncomeLoading = false;
        state.dailyIncomeStats = action.payload;
      })
      .addCase(fetchDailyIncomeStats.rejected, (state, action) => {
        state.dailyIncomeLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentProduct } = productSlice.actions;
export default productSlice.reducer;