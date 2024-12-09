import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { generateBill, fetchTodayIncome, updateTodayIncome } from '../../redux/slices/billSlice';
import LoadingWrapper from '../LoadingWrapper';

const BillGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [successMessage, setSuccessMessage] = useState('');
  const { todayIncome, todayIncomeLoading } = useSelector((state) => state.bills);
  const [manualIncome, setManualIncome] = useState('');

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
// 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(generateBill({ items, paymentMethod })).unwrap();
      await dispatch(fetchTodayIncome());
      setSuccessMessage('Bill generated successfully!');
      setTimeout(() => {
        navigate('/products'); 
      }, 2000); 
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  const calculateItemTotal = (item) => {
    const product = products.find(p => p._id === item.productId);
    console.log('Selected product:', product);
    console.log('Item quantity:', item.quantity);
    return product && item.quantity > 0 ? (product.costPrice * item.quantity) : 0;
  };

  const calculateBillTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  useEffect(() => {
    console.log('Products from state:', products);
  }, [products]);

  useEffect(() => {
    dispatch(fetchTodayIncome());
  }, [dispatch]);

  const handleUpdateIncome = async () => {
    try {
      await dispatch(updateTodayIncome(Number(manualIncome))).unwrap();
      setSuccessMessage('Income updated successfully!');
      setManualIncome(''); // Reset input after update
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  return (
    <LoadingWrapper isLoading={todayIncomeLoading}>
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>Generate Bill</Typography>
          
          <form onSubmit={handleSubmit}>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  select
                  label="Product"
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  fullWidth
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} - ${product.costPrice}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  sx={{ width: '150px' }}
                />
                
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ mb: 2 }}
            >
              Add Item
            </Button>
            
            <TextField
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
            </TextField>
            
            <Box sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Bill Preview</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => {
                      const product = products.find(p => p._id === item.productId);
                      if (!product) return null;
                      
                      const itemTotal = calculateItemTotal(item);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">
                            ${product. costPrice ? Number(product.costPrice).toFixed(2) : '0.00'}
                          </TableCell>
                          <TableCell align="right">{item.quantity || 0}</TableCell>
                          <TableCell align="right">
                            Rs{Number(itemTotal || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Total Amount:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${Number(calculateBillTotal() || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Payment Method: {paymentMethod.toUpperCase()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              type="submit"
              fullWidth
            >
              Generate Bill
            </Button>
          </form>
        </Paper>

        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>Today&apos;s Income</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              type="number"
              label="Current Income"
              value={todayIncome}
              disabled={true}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              type="number"
              label="Update Income"
              value={manualIncome}
              onChange={(e) => setManualIncome(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleUpdateIncome}
              disabled={!manualIncome || todayIncomeLoading}
            >
              Update Income
            </Button>
            <Button
              variant="outlined"
              onClick={() => dispatch(fetchTodayIncome())}
              disabled={todayIncomeLoading}
            >
              {todayIncomeLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LoadingWrapper>
  );
};

export default BillGenerator; 