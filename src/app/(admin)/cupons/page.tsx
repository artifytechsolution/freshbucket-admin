"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// ==========================================
// 1. SUB-COMPONENT: Create Coupon Modal
// ==========================================
const CreateCouponModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'PERCENTAGE',
      status: 'ACTIVE',
      usageLimit: 1000,
      perUserLimit: 1,
      minOrderValue: 0,
      maxDiscount: 0,
      value: 0
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        value: Number(data.value),
        minOrderValue: Number(data.minOrderValue),
        maxDiscount: Number(data.maxDiscount),
        usageLimit: Number(data.usageLimit),
        perUserLimit: Number(data.perUserLimit),
        validFrom: new Date(data.validFrom).toISOString(),
        validTo: new Date(data.validTo).toISOString(),
        status: data.status,
      };

      const response = await fetch("http://localhost:8030/api/cupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create coupon");
      }

      toast.success("Coupon Created Successfully!");
      reset();
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      setApiError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Create New Coupon</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <input
                {...register("code", { required: "Code is required", pattern: /^[A-Z0-9]+$/i })}
                placeholder="SAVE20"
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">Required (Letters/Numbers only)</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select {...register("type")} className="w-full border border-gray-300 rounded p-2 bg-white">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                {...register("description", { required: "Required" })}
                placeholder="e.g. 20% off on all products"
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
              <input type="number" step="0.01" {...register("value", { required: true, min: 0.01 })} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
              <input type="number" step="0.01" {...register("maxDiscount")} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
              <input type="number" step="0.01" {...register("minOrderValue")} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage Limit</label>
              <input type="number" {...register("usageLimit", { required: true })} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input type="datetime-local" {...register("validFrom", { required: true })} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
              <input type="datetime-local" {...register("validTo", { required: true })} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit Per User</label>
              <input type="number" {...register("perUserLimit", { required: true })} className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register("status")} className="w-full border border-gray-300 rounded p-2 bg-white">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. SUB-COMPONENT: Delete Confirmation Modal
// ==========================================
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, couponCode, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Coupon?</h3>
          <p className="text-center text-gray-500 text-sm">
            Are you sure you want to delete coupon <span className="font-bold text-gray-800">{couponCode}</span>? 
            This action cannot be undone.
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT: Full Page with Table
// ==========================================
export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({ isOpen: false, id: null, code: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Fetch Coupons Function ---
  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8030/api/cupon");
      const result = await response.json();

      if (result.status === "success") {
        setCoupons(result.data.coupons.data);
      } else {
        setError("Failed to load coupons.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Coupon Function ---
  const handleDeleteConfirm = async () => {
    if (!deleteModalData.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8030/api/cupon/${deleteModalData.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete coupon");
      }

      toast.success("Coupon deleted successfully");
      
      // Close modal and refresh data
      setDeleteModalData({ isOpen: false, id: null, code: '' });
      fetchCoupons();

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error deleting coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (coupon) => {
    setDeleteModalData({
      isOpen: true,
      id: coupon.id, // Assuming 'id' is the UUID from your database
      code: coupon.code
    });
  };

  // --- Initial Load ---
  useEffect(() => {
    fetchCoupons();
  }, []);

  // --- Helper: Date Formatter ---
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Page Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
            <p className="text-gray-500 mt-1">Manage and track your discount coupons</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Coupon
          </button>
        </div>

        {/* --- Error State --- */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* --- Table Container --- */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Validity Period</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Code & Desc */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                              {coupon.code}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={coupon.description}>
                              {coupon.description}
                            </span>
                          </div>
                        </td>

                        {/* Value */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`} OFF
                          </div>
                          <div className="text-xs text-gray-500">Min Order: ₹{coupon.minOrderValue}</div>
                        </td>

                        {/* Stats */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>Limit: <span className="font-semibold text-gray-900">{coupon.usageLimit}</span></div>
                          <div>Used: <span className="font-semibold text-gray-900">{coupon.usedCount || 0}</span></div>
                        </td>

                        {/* Dates */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span>{formatDate(coupon.validFrom)}</span>
                            <span className="text-xs text-gray-400 text-center w-4">to</span>
                            <span>{formatDate(coupon.validTo)}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${coupon.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}>
                            {coupon.status}
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openDeleteModal(coupon)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Coupon"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        No coupons found. Click "Add New Coupon" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      <CreateCouponModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchCoupons} 
      />

      <DeleteConfirmationModal 
        isOpen={deleteModalData.isOpen}
        onClose={() => setDeleteModalData({ ...deleteModalData, isOpen: false })}
        onConfirm={handleDeleteConfirm}
        couponCode={deleteModalData.code}
        isDeleting={isDeleting}
      />
    </div>
  );
}