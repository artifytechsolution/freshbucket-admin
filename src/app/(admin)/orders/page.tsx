"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TablePagination,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Divider,
} from "@mui/material";
import {
  ShoppingCart as OrderIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Inventory2 as ProductIcon,
  CheckCircle as DeliverIcon,
  FiberNew as NewBadgeIcon // Using FiberNew for the icon
} from "@mui/icons-material";

// ---- Utility Functions ----
export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return isoString;
  }
};

const isToday = (dateString: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// ---- Types ----
interface Product { id?: string; product_id?: number; name?: string; sku?: string; description?: string; }
interface Variant { id?: string; variant_id?: number; name?: string; sku?: string; product?: Product; }
interface OrderItem { id?: string; order_item_id?: number; order_id?: number; product_id?: number; variant_id?: number; quantity?: number; price?: number; total?: number; variant?: Variant; }
interface Address { fullName?: string; email?: string; phone?: string; addressType?: string; addressLine1?: string; addressLine2?: string; societyName?: string; societyArea?: string; city?: string; state?: string; pincode?: string; societyPincode?: string; isDeliveryAvailable?: boolean; }
interface User { id?: string; user_id?: number; name?: string; email?: string; phone?: string; }
interface Order { id: string; order_id: number; user_id: number; coupon_id?: number | null; totalAmount?: number; discount?: number; tax?: number; shippingCost?: number; grandTotal: number; status: string; paymentStatus: string; paymentMethod: string; shippingMethod?: string | null; Address?: Address | null; items?: OrderItem[]; user?: User | null; placedAt?: string; createdAt: string; updatedAt?: string; cancelledAt?: string | null; deliveredAt?: string | null; }
interface Meta { page: number; limit: number; total: number; totalPages: number; }
interface ApiResponse { status: string; data?: { data?: Order[]; meta?: Meta; }; message?: string; }

// ---- Status Config ----
const ORDER_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const getStatusColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED": return "success";
    case "PENDING": return "warning";
    case "CANCELLED": return "error";
    case "DELIVERED": return "info";
    case "SHIPPED": return "primary";
    default: return "default";
  }
};

const getPaymentStatusColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "PAID": return "success";
    case "UNPAID": return "warning";
    case "FAILED": return "error";
    default: return "default";
  }
};

export default function OrderManagementTable() {
  
  // ---- State Management ----
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); 
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ---- Fetch Logic ----
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const params = new URLSearchParams();
      const currentPage = meta?.page || 1;
      const currentLimit = meta?.limit || 10;

      params.append('page', currentPage.toString());
      params.append('limit', currentLimit.toString());
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');
      
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentStatusFilter !== 'all') params.append('paymentStatus', paymentStatusFilter);
      if (dateFilter !== 'all') params.append('dateFilter', dateFilter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ''}/api/orders?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if(result?.status === "success") {
          let rawData = result?.data?.data || [];
          
          // ---- CUSTOM SORTING LOGIC ----
          // Priority: 1. Status='CONFIRMED', 2. Date Descending
          const sortedData = rawData.sort((a, b) => {
            const isAConfirmed = a.status === 'CONFIRMED';
            const isBConfirmed = b.status === 'CONFIRMED';

            if (isAConfirmed && !isBConfirmed) return -1;
            if (!isAConfirmed && isBConfirmed) return 1;
            
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setOrderList(sortedData);
          const metaData = result?.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
          setMeta(metaData);
          toast.success("Orders synced", { id: 'sync-success', duration: 2000 });
      } else {
        throw new Error(result?.message || "Failed to fetch orders");
      }

    } catch (error) {
      console.error("Orders fetch error:", error);
      setIsError(true);
      const errorMsg = error instanceof Error ? error.message : "Failed to load orders.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [meta?.page, meta?.limit, debouncedSearch, statusFilter, paymentStatusFilter, dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ---- Handlers ----
  const handlePageChange = (event: unknown, newPage: number) => {
    setMeta(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setMeta(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleMarkDelivered = async (orderId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ''}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "DELIVERED"
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Order #${orderId} marked as Delivered`);
        fetchOrders();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order status");
    }
  };

  // Safe Math
  const totalRevenue = orderList.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* ---- Header ---- */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Breadcrumbs sx={{ mb: 1, fontSize: '0.875rem' }}>
            <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Dashboard
            </Link>
            <Typography color="text.primary" fontWeight={500}>Orders</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
            Order Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          disabled={isLoading}
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #4f46e5, #6366f1)'
          }}
        >
          Sync Data
        </Button>
      </Box>

      {/* ---- Stats Cards ---- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Orders (Found)", value: meta?.total || 0, icon: <OrderIcon />, color: '#3b82f6', bg: '#eff6ff' },
          { label: "Revenue (Visible)", value: `₹${totalRevenue.toLocaleString()}`, icon: <MoneyIcon />, color: '#10b981', bg: '#ecfdf5' },
          { label: "Pending (Page)", value: orderList.filter(o => o?.status === 'PENDING').length, icon: <ShippingIcon />, color: '#f59e0b', bg: '#fffbeb' },
          { label: "Avg Value (Page)", value: orderList.length ? `₹${(totalRevenue / orderList.length).toFixed(0)}` : '0', icon: <PaymentIcon />, color: '#8b5cf6', bg: '#f5f3ff' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: '#1e293b' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---- Table Section ---- */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        
        {isLoading ? (
          <Box sx={{ p: 10, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={40} thickness={4} />
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading order data...</Typography>
          </Box>
        ) : isError ? (
          <Box sx={{ p: 4 }}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    {['Order ID', 'Customer', 'Date', 'Status', 'Payment', 'Method', 'Total', 'Actions'].map((head) => (
                      <TableCell key={head} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList && orderList.length > 0 ? (
                    orderList.map((order) => {
                      
                      // ---- CORE LOGIC FOR NEW ORDERS ----
                      // 1. Must be TODAY
                      const isCreatedToday = isToday(order.createdAt);
                      // 2. Must be CONFIRMED status
                      const isNewAndConfirmed = order.status === 'CONFIRMED' && isCreatedToday;
                      
                      return (
                        <TableRow 
                          key={order?.id} 
                          hover 
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            // Highlight Green for Confirmed New Orders
                            backgroundColor: isNewAndConfirmed ? '#F0FDF4' : 'inherit', 
                            transition: 'background-color 0.3s',
                            position: 'relative',
                            // Left border indicator (Green)
                            '&::before': isNewAndConfirmed ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '4px',
                              backgroundColor: '#22C55E' 
                            } : {}
                          }}
                        >
                          {/* Order ID + NEW ICON */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography fontWeight={700} color="primary" variant="body2">
                                  #{order?.order_id}
                                </Typography>
                                
                                {/* ---- NEW ICON DISPLAY ---- */}
                                {/* Only show if CONFIRMED + TODAY */}
                                {isNewAndConfirmed && (
                                  <Chip 
                                    icon={<NewBadgeIcon sx={{ '&&': { color: '#166534' }, fontSize: '1.2rem' }} />}
                                    label="NEW" 
                                    size="small" 
                                    sx={{ 
                                      height: 22, 
                                      fontSize: '0.65rem', 
                                      fontWeight: 800,
                                      pl: 0,
                                      backgroundColor: '#DCFCE7',
                                      color: '#166534',
                                      animation: 'pulse 2s infinite',
                                      '@keyframes pulse': {
                                        '0%': { opacity: 0.8 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.8 }
                                      }
                                    }} 
                                  />
                                )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.65rem', display: 'block'}}>
                              {order?.id?.slice(0,8)}...
                            </Typography>
                          </TableCell>

                          {/* Customer */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#e2e8f0', color: '#475569' }}>
                                {order?.Address?.fullName ? order.Address.fullName.charAt(0).toUpperCase() : (order?.user?.name ? order.user.name.charAt(0).toUpperCase() : 'U')}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                    {order?.Address?.fullName || order?.user?.name || `User ${order?.user_id}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {order?.Address?.city || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* Date */}
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight={500}>{new Date(order?.createdAt).toLocaleDateString()}</Typography>
                              <Typography variant="caption" color="text.secondary">{new Date(order?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Typography>
                            </Box>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Chip label={order?.status} size="small" color={getStatusColor(order?.status)} sx={{ fontWeight: 600, borderRadius: 1.5, height: 24 }} />
                          </TableCell>

                          {/* Payment */}
                          <TableCell>
                            <Chip label={order?.paymentStatus} size="small" color={getPaymentStatusColor(order?.paymentStatus)} variant="outlined" sx={{ fontWeight: 600, border: 'none', bgcolor: '#f1f5f9' }} />
                          </TableCell>

                          {/* Method */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ border: '1px solid #e2e8f0', px: 1, py: 0.5, borderRadius: 1 }}>
                                {order?.paymentMethod}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Total */}
                          <TableCell>
                            <Typography fontWeight={600} color="success.main">
                              ₹{(order?.grandTotal || 0).toLocaleString()}
                            </Typography>
                          </TableCell>

                          {/* Actions */}
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {order?.status !== 'DELIVERED' && order?.status !== 'CANCELLED' && (
                                <Tooltip title="Mark as Delivered">
                                  <IconButton 
                                    onClick={() => handleMarkDelivered(order.order_id)} 
                                    color="success" 
                                    size="small" 
                                    sx={{ bgcolor: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5' } }}
                                  >
                                    <DeliverIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="View Details">
                                <IconButton onClick={() => handleViewDetails(order)} color="primary" size="small" sx={{ bgcolor: '#eef2ff' }}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <OrderIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                        <Typography color="text.secondary">No orders found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={meta?.total || 0}
              page={(meta?.page || 1) - 1}
              onPageChange={handlePageChange}
              rowsPerPage={meta?.limit || 10}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* ---- Detailed Order Dialog ---- */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="lg"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            overflow: 'hidden',
            bgcolor: '#F8FAFC',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          } 
        }}
      >
        {selectedOrder && (
          <>
            {/* ---- HEADER SECTION ---- */}
            <Box sx={{ bgcolor: '#fff', p: 3, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h5" fontWeight={800} color="#1E293B">
                    Order #{selectedOrder.order_id}
                  </Typography>
                  <Chip 
                    label={selectedOrder.status} 
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 2, px: 1 }}
                  />
                  <Chip 
                    label={selectedOrder.paymentStatus} 
                    variant="outlined"
                    color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon fontSize="small" sx={{ fontSize: 16 }} />
                  Placed on {formatDateTime(selectedOrder.placedAt)}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailsDialogOpen(false)} sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* ---- PROGRESS STEPPER ---- */}
            <Box sx={{ bgcolor: '#fff', px: 4, py: 3, borderBottom: '1px solid #E2E8F0' }}>
              <Stepper activeStep={ORDER_STEPS.indexOf(selectedOrder?.status || 'PENDING') + 1} alternativeLabel>
                {ORDER_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ 
                      sx: { 
                        '&.Mui-active': { color: '#4F46E5' }, 
                        '&.Mui-completed': { color: '#10B981' } 
                      } 
                    }}>
                      <Typography variant="caption" fontWeight={600} color={ORDER_STEPS.indexOf(selectedOrder?.status || '') >= ORDER_STEPS.indexOf(label) ? 'text.primary' : 'text.disabled'}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                
                {/* ---- LEFT COLUMN: ITEMS & FINANCIALS ---- */}
                <Grid item xs={12} md={8}>
                  
                  {/* Items Card */}
                  <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', mb: 3, bgcolor: '#fff' }}>
                    <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProductIcon fontSize="small" color="primary" /> 
                        Order Items ({selectedOrder.items?.length || 0})
                      </Typography>
                    </Box>
                    
                    <TableContainer>
                      <Table sx={{ minWidth: 500 }}>
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', py: 1.5 }}>PRODUCT</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', py: 1.5 }}>UNIT PRICE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', py: 1.5 }}>QTY</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', py: 1.5 }}>TOTAL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item) => (
                              <TableRow key={item?.id} hover>
                                <TableCell sx={{ py: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{ 
                                      width: 40, height: 40, 
                                      borderRadius: 2, 
                                      bgcolor: '#EEF2FF', 
                                      color: '#4F46E5', 
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontWeight: 700, fontSize: '1rem'
                                    }}>
                                      {(item?.variant?.product?.name || "P").charAt(0).toUpperCase()}
                                    </Box>
                                    <Box>
                                      <Typography variant="body2" fontWeight={600} color="#1E293B">
                                        {item?.variant?.product?.name || `Product #${item?.product_id}`}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {item?.variant?.name}
                                        {item?.variant?.sku && (
                                          <Chip label={item.variant.sku} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#F1F5F9' }} />
                                        )}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ color: '#64748B' }}>₹{item?.price}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>x{item?.quantity}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#1E293B' }}>₹{item?.total}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow><TableCell colSpan={4} align="center">No items found.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>

                  {/* Financial Breakdown */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Paper elevation={0} sx={{ width: { xs: '100%', sm: 300 }, borderRadius: 3, border: '1px solid #E2E8F0', p: 2.5, bgcolor: '#fff' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body2" fontWeight={600}>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">Shipping</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedOrder.shippingCost ? `₹${selectedOrder.shippingCost}` : 'Free'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">Tax</Typography>
                        <Typography variant="body2" fontWeight={600}>₹{(selectedOrder.tax || 0).toLocaleString()}</Typography>
                      </Box>
                      {(selectedOrder.discount || 0) > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: 'success.main' }}>
                          <Typography variant="body2" fontWeight={500}>Discount</Typography>
                          <Typography variant="body2" fontWeight={700}>-₹{(selectedOrder.discount || 0).toLocaleString()}</Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={700} color="#1E293B">Total</Typography>
                        <Typography variant="h6" fontWeight={800} color="#4F46E5">
                          ₹{(selectedOrder.grandTotal || 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>

                {/* ---- RIGHT COLUMN: SIDEBAR INFO ---- */}
                <Grid item xs={12} md={4}>
                  
                  {/* Customer Card */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#fff', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#94A3B8', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                      CUSTOMER DETAILS
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700 }}>
                        {selectedOrder.Address?.fullName ? selectedOrder.Address.fullName.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#1E293B">
                          {selectedOrder.Address?.fullName || selectedOrder.user?.name || "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {selectedOrder.user_id}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                       <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <PhoneIcon fontSize="small" sx={{ color: '#94A3B8', mt: 0.2 }} />
                          <Typography variant="body2" color="#334155" fontWeight={500}>
                            {selectedOrder.Address?.phone || selectedOrder.user?.phone || 'N/A'}
                          </Typography>
                       </Box>
                       <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <EmailIcon fontSize="small" sx={{ color: '#94A3B8', mt: 0.2 }} />
                          <Typography variant="body2" color="#334155" sx={{ wordBreak: 'break-all' }}>
                            {selectedOrder.Address?.email || selectedOrder.user?.email || 'N/A'}
                          </Typography>
                       </Box>
                    </Box>
                  </Paper>

                  {/* Shipping Card */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#fff' }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#94A3B8', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                      SHIPPING ADDRESS
                    </Typography>
                    
                    {selectedOrder.Address ? (
                      <Box sx={{ position: 'relative' }}>
                        <Box sx={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 3, bgcolor: '#CBD5E1', borderRadius: 4 }} />
                        <Box sx={{ pl: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {selectedOrder.Address.addressType === 'home' ? <HomeIcon fontSize="small" color="action"/> : <WorkIcon fontSize="small" color="action"/>}
                            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', color: '#64748B' }}>
                              {selectedOrder.Address.addressType}
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="#334155" lineHeight={1.6}>
                            {selectedOrder.Address.addressLine1} <br />
                            {selectedOrder.Address.societyName}, {selectedOrder.Address.societyArea} <br />
                            <Typography component="span" fontWeight={600}>
                              {selectedOrder.Address.city}, {selectedOrder.Address.state} - {selectedOrder.Address.pincode}
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">No address provided.</Typography>
                    )}
                  </Paper>

                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
               <Button onClick={() => setDetailsDialogOpen(false)} sx={{ color: '#64748B', fontWeight: 600 }}>
                 Close
               </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}