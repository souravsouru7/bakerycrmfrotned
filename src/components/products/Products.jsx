import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import StockAdjustment from './StockAdjustment';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../../components/ui/alert-dialog";
import { Plus, Search, Package, Edit, Trash2, Eye, BarChart3, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingWrapper from '../LoadingWrapper';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStockAdjustment, setOpenStockAdjustment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (product) => {
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <LoadingWrapper isLoading={loading}>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Products Management</h1>
                  <p className="text-muted-foreground mt-1">Manage your inventory and product details</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-9 w-full sm:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" asChild>
                    <Link to="/inventory-dashboard">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  
                  <Button onClick={() => setOpenForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredProducts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products available</h3>
                <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
                <Button onClick={() => setOpenForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <Badge variant={product.currentStock > 0 ? "success" : "destructive"}>
                        Stock: {product.currentStock}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-muted-foreground">
                        Price: <span className="font-medium text-foreground">Rs{product.costPrice}</span>
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenStockAdjustment(true);
                        }}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent>
              <ProductForm 
                product={selectedProduct} 
                onClose={() => {
                  setOpenForm(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openDetails} onOpenChange={setOpenDetails}>
            <DialogContent>
              <ProductDetails 
                product={selectedProduct} 
                onClose={() => {
                  setOpenDetails(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openStockAdjustment} onOpenChange={setOpenStockAdjustment}>
            <DialogContent>
              <StockAdjustment
                product={selectedProduct}
                onClose={() => {
                  setOpenStockAdjustment(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {productToDelete?.name}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleDelete(productToDelete)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default Products;