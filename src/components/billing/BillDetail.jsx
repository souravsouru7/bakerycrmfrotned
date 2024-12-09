import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { fetchBillById } from '../../redux/slices/billSlice';

const BillDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBill, loading } = useSelector((state) => state.bills);

  useEffect(() => {
    if (id) {
      dispatch(fetchBillById(id));
    }
  }, [dispatch, id]);

  const handleDownloadPDF = async () => {
    try {
      window.open(`/api/bills/${id}/pdf`, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading || !currentBill) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Bill Details</Typography>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </Box>

        <Typography variant="body1" gutterBottom>
          Bill ID: {currentBill._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Date: {new Date(currentBill.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Payment Method: {currentBill.paymentMethod}
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentBill.items?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.product?.name || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${(item.cost / item.quantity)?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>${item.cost?.toFixed(2) || '0.00'}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>Total Amount:</strong>
                </TableCell>
                <TableCell>
                  <strong>${currentBill.totalCost?.toFixed(2) || '0.00'}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default BillDetail; 