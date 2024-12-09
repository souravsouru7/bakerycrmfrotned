import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    costPrice: product?.costPrice || '',
    currentStock: product?.currentStock || '',
    isActive: product?.isActive ?? true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (product) {
        // Update existing product
        await dispatch(updateProduct({
          id: product._id,
          data: formData
        })).unwrap();
      } else {
        // Create new product
        await dispatch(createProduct(formData)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {product ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            fullWidth
          />
          <TextField
            name="category"
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
            fullWidth
          />
          <TextField
            name="costPrice"
            label="Cost Price"
            type="number"
            value={formData.costPrice}
            onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
            required
            fullWidth
          />
          <TextField
            name="currentStock"
            label="Current Stock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
            required
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (product ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProductForm; 