import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import moment from 'moment';
import { 
  fetchInventoryValue, 
  fetchCategoryWiseValue, 
  fetchDailyIncomeStats 
} from '../../redux/slices/productSlice';

// SummaryCard Component
const SummaryCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      background: `linear-gradient(45deg, ${color}22 30%, #ffffff 90%)`
    }}
  >
    <Box>
      <Typography color="textSecondary" variant="h6" component="h2">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ color: color }}>
      {icon}
    </Box>
  </Paper>
);

// CategoryPieChart Component
const CategoryPieChart = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Category Distribution</Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

// DailyIncomeChart Component
const DailyIncomeChart = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  const { dailyIncomeStats, dailyIncomeLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchDailyIncomeStats(dateRange));
  }, [dispatch, dateRange]);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (dailyIncomeLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 3 
      }}>
        <Typography variant="h6">Daily Income Statistics</Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2 
        }}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyIncomeStats?.stats || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => moment(date).format('MMM DD')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Income']}
                  labelFormatter={(date) => moment(date).format('MMMM DD, YYYY')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalIncome"
                  name="Total Income"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Main InventoryDashboard Component
const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const { 
    inventorySummary, 
    categoryWiseValue, 
    loading 
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchInventoryValue());
    dispatch(fetchCategoryWiseValue());
  }, [dispatch]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        Inventory Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Products"
            value={inventorySummary?.totalProducts || 0}
            icon={<InventoryIcon sx={{ fontSize: 40 }} />}
            color="#0088FE"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Value"
            value={`₹${inventorySummary?.totalValue?.toLocaleString() || 0}`}
            icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
            color="#00C49F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Categories"
            value={inventorySummary?.totalCategories || 0}
            icon={<CategoryIcon sx={{ fontSize: 40 }} />}
            color="#FFBB28"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Low Stock Items"
            value={inventorySummary?.lowStockItems || 0}
            icon={<LocalShippingIcon sx={{ fontSize: 40 }} />}
            color="#FF8042"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <DailyIncomeChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <CategoryPieChart data={categoryWiseValue || []} />
        </Grid>
      </Grid>

 
    </Container>
  );
};

export default InventoryDashboard;