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
  Typography,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Divider,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  WarningAmber as WarningIcon
} from "@mui/icons-material";
import { useUserList } from "@/hooks/apiHooks";

// ---- Types ----
interface User {
  id: string;
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

// ---- Utils for Avatar Colors ----
function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  const nameParts = name.split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}` 
    : `${nameParts[0][0]}`;
    
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 32,
      height: 32,
      fontSize: '0.875rem',
      mr: 2
    },
    children: initials.toUpperCase(),
  };
}

export default function UserManagementTable() {
  const [userList, setUserList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ---- Dropdown Menu State ----
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ---- Delete Dialog State ----
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    isError,
    isLoading,
    data: userData,
    error,
    mutate: fetchUsers,
  } = useUserList();

  // Fetch users once on mount
  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  // Handle data & errors
  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    }
    if (Array.isArray(userData?.data)) {
      setUserList(userData.data);
    }
  }, [isError, isLoading, error, userData]);

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    return userList.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
  }, [userList, searchTerm]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // ---- Action Handlers ----

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation(); // Prevent row click
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedUser immediately to prevent UI flicker
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);

    try {
      // ---------------------------------------------------------
      // TODO: Replace this with your actual API delete call
      // e.g., await deleteUser(selectedUser.id);
      // ---------------------------------------------------------
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // Optimistic update: Remove user from local state immediately
      setUserList((prev) => prev.filter((u) => u.id !== selectedUser.id));
      
      toast.success(`User "${selectedUser.name}" deleted successfully`);
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setSelectedUser(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }} separator="›">
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.primary" fontWeight={500}>User Management</Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        {/* Header Section */}
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            bgcolor: 'common.white'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                All Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userList.length} total active members
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
             <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Tooltip title="Refresh List">
              <IconButton onClick={() => fetchUsers("")} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Divider />

        {/* Error State */}
        {!isLoading && isError && (
          <Box p={2}>
             <Alert severity="error">Error loading users. Please refresh the page.</Alert>
          </Box>
        )}

        {/* Table Container */}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'text.secondary' }}>User Details</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'text.secondary' }}>Contact Info</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                <TableCell align="right" sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'text.secondary' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Loading Skeletons */}
              {isLoading && Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Stack direction="row" spacing={2}><Skeleton variant="circular" width={32} height={32} /><Box><Skeleton width={100} /><Skeleton width={60} height={15} /></Box></Stack></TableCell>
                  <TableCell><Skeleton width={150} /><Skeleton width={100} height={15} /></TableCell>
                  <TableCell><Skeleton width={60} height={24} sx={{ borderRadius: 4 }} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={30} height={30} sx={{ display: 'inline-block' }} /></TableCell>
                </TableRow>
              ))}

              {/* Data Rows */}
              {!isLoading && !isError && filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover .action-btn': { opacity: 1, backgroundColor: 'action.hover' },
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Name & Avatar */}
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      <Avatar {...stringAvatar(user.name)} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: #{user.user_id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Contact Info (Click to copy) */}
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Tooltip title="Click to copy email" placement="top-start">
                        <Stack 
                          direction="row" 
                          alignItems="center" 
                          spacing={1} 
                          onClick={(e) => { e.stopPropagation(); handleCopy(user.email, 'Email'); }}
                          sx={{ cursor: 'pointer', width: 'fit-content', '&:hover': { color: 'primary.main' } }}
                        >
                          <EmailIcon sx={{ fontSize: 16, color: 'action.active' }} />
                          <Typography variant="body2">{user.email}</Typography>
                        </Stack>
                      </Tooltip>
                      
                      <Tooltip title="Click to copy phone" placement="bottom-start">
                        <Stack 
                          direction="row" 
                          alignItems="center" 
                          spacing={1}
                          onClick={(e) => { e.stopPropagation(); handleCopy(user.phone, 'Phone'); }}
                          sx={{ cursor: 'pointer', width: 'fit-content', '&:hover': { color: 'primary.main' } }}
                        >
                          <PhoneIcon sx={{ fontSize: 16, color: 'action.active' }} />
                          <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                        </Stack>
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  {/* Fake Status (Placeholder for UI) */}
                  <TableCell>
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                      sx={{ bgcolor: 'success.lighter', borderColor: 'success.light' }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <Tooltip title="Options">
                      <IconButton 
                        size="small" 
                        className="action-btn"
                        onClick={(e) => handleMenuOpen(e, user)}
                        sx={{ opacity: { xs: 1, sm: 0.6 } }} 
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty State */}
              {!isLoading && !isError && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu (Dropdown) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 150, borderRadius: 2, mt: 1 }
        }}
      >
        <MenuItem onClick={() => { console.log('Edit clicked'); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit Details</Typography>
        </MenuItem>
        
        <Divider sx={{ my: 0.5 }} />
        
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>Delete User</Typography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={isDeleting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained" 
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}