import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Chip,
} from '@mui/material';

const ProductDetails = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1">{product.category}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Unit Price
              </Typography>
              <Typography variant="body1">${product.unitPrice}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Cost Price
              </Typography>
              <Typography variant="body1">${product.costPrice}</Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Current Stock
              </Typography>
              <Typography variant="body1">
                {product.currentStock} {product.unit}
                {product.currentStock <= product.minimumStockLevel && (
                  <Chip 
                    label="Low Stock" 
                    color="error" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Minimum Stock Level
              </Typography>
              <Typography variant="body1">
                {product.minimumStockLevel} {product.unit}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails; 