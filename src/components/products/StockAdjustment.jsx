import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../redux/slices/productSlice';

const StockAdjustment = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [adjustment, setAdjustment] = useState({
    type: 'add',
    quantity: '',
    reason: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStock = adjustment.type === 'add' 
      ? product.currentStock + Number(adjustment.quantity)
      : product.currentStock - Number(adjustment.quantity);

    await dispatch(updateProduct({
      id: product._id,
      data: { 
        ...product,
        currentStock: newStock,
      }
    }));
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adjust Stock for {product.name}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              value={adjustment.type}
              label="Adjustment Type"
              onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
            >
              <MenuItem value="add">Add Stock</MenuItem>
              <MenuItem value="remove">Remove Stock</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            label="Quantity"
            type="number"
            value={adjustment.quantity}
            onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Reason"
            multiline
            rows={2}
            value={adjustment.reason}
            onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!adjustment.quantity}
        >
          Adjust Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockAdjustment; 