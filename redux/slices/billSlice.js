// Add this new action
export const updateTodayIncome = createAsyncThunk(
  'bills/updateTodayIncome',
  async (income) => {
    const response = await axios.post('/api/bills/today/income', { income });
    return response.data.data.income;
  }
);

// In your slice reducers, add:
extraReducers: (builder) => {
  // ... existing reducers ...
  
  builder
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
}