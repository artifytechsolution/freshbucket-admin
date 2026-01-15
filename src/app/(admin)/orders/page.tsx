"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
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
  Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart as OrderIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  ReceiptLong as ReceiptIcon,
  LocalOffer as CouponIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon
} from "@mui/icons-material";

// ---- Utility Function ----
export const formatDateTime = (isoString: string | null) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

// ---- Types ----
interface Address {
  fullName: string;
  email: string;
  phone: string;
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  societyName: string;
  societyArea: string;
  city: string;
  state: string;
  pincode: string;
  societyPincode: string;
  isDeliveryAvailable: boolean;
}

interface Order {
  id: string;
  order_id: number;
  user_id: number;
  coupon_id: number | null;
  totalAmount: number;
  discount: number;
  tax: number;
  shippingCost: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string | null;
  Address: Address | null;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  deliveredAt: string | null;
}

interface ApiResponse {
  status: string;
  data: {
    data: Order[];
    total: number;
  };
  message: string;
}

// ---- Status Config ----
const ORDER_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'];

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "CONFIRMED": return "success";
    case "PENDING": return "warning";
    case "CANCELLED": return "error";
    case "DELIVERED": return "info";
    case "PROCESSING": return "primary";
    default: return "default";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID": return "success";
    case "PENDING": return "warning";
    case "FAILED": return "error";
    case "REFUNDED": return "secondary";
    default: return "default";
  }
};

export default function OrderManagementTable() {
  
  // State
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetch('http://localhost:8030/api/orders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      const ordersData = result.data.data || [];

      setOrderList(ordersData);
      
      toast.success(`Updated: ${ordersData.length} orders loaded`, {
        id: 'order-fetch',
        icon: '🔄',
      });

    } catch (error) {
      console.error("Orders fetch error:", error);
      setIsError(true);
      const errorMsg = error instanceof Error ? error.message : "Failed to load orders.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtering Logic
  const uniqueStatuses = useMemo(() => [...new Set(orderList.map(order => order.status))], [orderList]);
  const uniquePaymentStatuses = useMemo(() => [...new Set(orderList.map(order => order.paymentStatus))], [orderList]);
  const uniquePaymentMethods = useMemo(() => [...new Set(orderList.map(order => order.paymentMethod))], [orderList]);

  const filteredOrders = useMemo(() => {
    return orderList.filter(order => {
      const orderId = order.order_id.toString();
      const userId = order.user_id.toString();
      
      const matchesSearch = 
        orderId.includes(searchQuery) ||
        userId.includes(searchQuery) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.Address?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;
      const matchesPaymentMethod = paymentMethodFilter === "all" || order.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod;
    });
  }, [orderList, searchQuery, statusFilter, paymentStatusFilter, paymentMethodFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // Handlers
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPaymentMethodFilter("all");
    setPage(0);
    toast.success("Filters cleared");
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  // Stats Calculation
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING').length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* ---- Header & Breadcrumbs ---- */}
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
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            background: 'linear-gradient(45deg, #4f46e5, #6366f1)'
          }}
        >
          Sync Data
        </Button>
      </Box>

      {/* ---- Stats Cards ---- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Orders", value: filteredOrders.length, icon: <OrderIcon />, color: '#3b82f6', bg: '#eff6ff' },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <MoneyIcon />, color: '#10b981', bg: '#ecfdf5' },
          { label: "Pending Processing", value: pendingOrders, icon: <ShippingIcon />, color: '#f59e0b', bg: '#fffbeb' },
          { label: "Avg. Order Value", value: filteredOrders.length ? `₹${(totalRevenue / filteredOrders.length).toFixed(0)}` : '0', icon: <PaymentIcon />, color: '#8b5cf6', bg: '#f5f3ff' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: '#1e293b' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: stat.bg, color: stat.color, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---- Filters & Table Section ---- */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by ID, User, or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                  sx: { borderRadius: 2, backgroundColor: '#f8fafc' }
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  {uniqueStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment</InputLabel>
                <Select value={paymentStatusFilter} label="Payment" onChange={(e) => setPaymentStatusFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  {uniquePaymentStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
               <Button onClick={handleReset} color="inherit" size="small" startIcon={<CloseIcon />}>
                 Clear
               </Button>
            </Grid>
          </Grid>
        </Box>

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
                  {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                    <TableRow key={order.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography fontWeight={700} color="primary" variant="body2">
                          #{order.order_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#e2e8f0', color: '#475569' }}>
                            {order.Address?.fullName ? order.Address.fullName.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          <Box>
                             <Typography variant="body2" fontWeight={500}>
                                {order.Address?.fullName || `User ${order.user_id}`}
                             </Typography>
                             <Typography variant="caption" color="text.secondary" display="block">
                                {order.Address?.city || 'N/A'}
                             </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" fontWeight={500}>{new Date(order.placedAt).toLocaleDateString()}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(order.placedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={order.status} size="small" color={getStatusColor(order.status)} sx={{ fontWeight: 600, borderRadius: 1.5, height: 24 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={order.paymentStatus} size="small" color={getPaymentStatusColor(order.paymentStatus)} variant="outlined" sx={{ fontWeight: 600, border: 'none', bgcolor: '#f1f5f9' }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Typography variant="caption" sx={{ border: '1px solid #e2e8f0', px: 1, py: 0.5, borderRadius: 1 }}>
                             {order.paymentMethod}
                           </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} color="success.main">
                          ₹{order.grandTotal.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleViewDetails(order)} color="primary" size="small" sx={{ bgcolor: '#eef2ff' }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <OrderIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                        <Typography color="text.secondary">No orders found matching your filters.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredOrders.length}
              page={page}
              onPageChange={(e, n) => setPage(n)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* ---- Detailed Order Dialog (Invoice Style) ---- */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {selectedOrder && (
          <>
            {/* Modal Header */}
            <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={700}>ORDER #{selectedOrder.order_id}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="h5" fontWeight={700}>
                       ₹{selectedOrder.grandTotal.toLocaleString()}
                    </Typography>
                    <Chip 
                      label={selectedOrder.paymentStatus} 
                      size="small" 
                      color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                      sx={{ height: 20, fontSize: '0.65rem' }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Placed on {formatDateTime(selectedOrder.placedAt)}
                  </Typography>
                </Box>
                <IconButton onClick={() => setDetailsDialogOpen(false)}><CloseIcon /></IconButton>
              </Box>

              <Stepper activeStep={ORDER_STEPS.indexOf(selectedOrder.status) + 1} alternativeLabel>
                {ORDER_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: 'primary.main' }, '&.Mui-completed': { color: 'success.main' } } }}>
                      <Typography variant="caption" fontWeight={600}>{label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              <Grid container>
                {/* Left Column: Financials & Timeline */}
                <Grid item xs={12} md={7} sx={{ p: 3 }}>
                   <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <ReceiptIcon fontSize="small" color="primary" /> Invoice Details
                   </Typography>
                   
                   <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>Subtotal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{selectedOrder.totalAmount.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>Shipping</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{selectedOrder.shippingCost.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>Tax</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{selectedOrder.tax.toLocaleString()}</TableCell>
                          </TableRow>
                          {selectedOrder.discount > 0 && (
                            <TableRow sx={{ bgcolor: '#f0fdf4' }}>
                              <TableCell sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CouponIcon fontSize="inherit" /> Discount
                              </TableCell>
                              <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>-₹{selectedOrder.discount.toLocaleString()}</TableCell>
                            </TableRow>
                          )}
                          <TableRow sx={{ '& td': { borderBottom: 0, fontSize: '1rem', py: 2 } }}>
                            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{selectedOrder.grandTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                   </Paper>

                   <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <CalendarIcon fontSize="small" color="primary" /> Timeline
                   </Typography>
                   <Grid container spacing={2}>
                      <Grid item xs={6}>
                         <Paper sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }} elevation={0}>
                            <Typography variant="caption" color="text.secondary" display="block">Created At</Typography>
                            <Typography variant="body2" fontWeight={500}>{formatDateTime(selectedOrder.createdAt)}</Typography>
                         </Paper>
                      </Grid>
                      <Grid item xs={6}>
                         <Paper sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }} elevation={0}>
                            <Typography variant="caption" color="text.secondary" display="block">Last Updated</Typography>
                            <Typography variant="body2" fontWeight={500}>{formatDateTime(selectedOrder.updatedAt)}</Typography>
                         </Paper>
                      </Grid>
                   </Grid>
                </Grid>

                {/* Right Column: Address & Customer */}
                <Grid item xs={12} md={5} sx={{ bgcolor: '#f8fafc', borderLeft: '1px solid #e2e8f0', p: 3 }}>
                    
                    {/* Customer Info */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>CUSTOMER</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                          {selectedOrder.Address?.fullName ? selectedOrder.Address.fullName.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {selectedOrder.Address?.fullName || `User ${selectedOrder.user_id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">ID: {selectedOrder.user_id}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Shipping Address Card */}
                    <Box sx={{ mb: 4 }}>
                       <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>SHIPPING ADDRESS</Typography>
                       {selectedOrder.Address ? (
                         <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                                {selectedOrder.Address.addressType === 'home' ? <HomeIcon color="action" fontSize="small"/> : <WorkIcon color="action" fontSize="small"/>}
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary', mt: 0.3 }}>
                                  {selectedOrder.Address.addressType}
                                </Typography>
                            </Box>
                            
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                              {selectedOrder.Address.fullName}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                              <LocationIcon fontSize="small" sx={{ color: 'text.disabled', fontSize: '1rem', mt: 0.3 }} />
                              <Typography variant="body2" color="text.secondary">
                                {selectedOrder.Address.societyName}, {selectedOrder.Address.societyArea} <br />
                                {selectedOrder.Address.addressLine1} <br />
                                {selectedOrder.Address.city}, {selectedOrder.Address.state} - {selectedOrder.Address.pincode}
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ color: 'text.disabled', fontSize: '1rem' }} />
                                <Typography variant="body2">{selectedOrder.Address.phone}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon fontSize="small" sx={{ color: 'text.disabled', fontSize: '1rem' }} />
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{selectedOrder.Address.email}</Typography>
                              </Box>
                            </Box>
                         </Paper>
                       ) : (
                         <Typography variant="body2" color="text.secondary" fontStyle="italic">No address provided.</Typography>
                       )}
                    </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
               <Button onClick={() => setDetailsDialogOpen(false)} color="inherit">Close</Button>
               <Button variant="contained" startIcon={<CopyIcon />} onClick={() => navigator.clipboard.writeText(selectedOrder.id)}>
                 Copy UUID
               </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}