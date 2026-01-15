"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Visibility as VisibilityIcon, 
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";
import { useParams } from "next/navigation";

// ===================== INTERFACES =====================
interface Unit {
  unit_id: number;
  name: string;
  short: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  product_id: number;
  name: string;
  slug: string | null;
  description: string;
  sku: string;
  price: number;
  stock: number;
  isVisible: boolean;
  isFeatured: boolean;
  isPerishable: boolean;
  expiryDays: number;
  inStock: string;
  category_id: number;
  unit_id: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductVariant {
  id: string;
  variant_id: number;
  product_id: number;
  name: string;
  unit_id: number;
  sku: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  unit: Unit;
}

interface VariantListResponse {
  status: string;
  data: {
    data: ProductVariant[];
    total: number;
  };
  message: string;
}

interface UnitApiResponse {
  status: string;
  data: {
    data: Unit[];
    total: number;
  };
  message: string;
}

interface VariantFormData {
  name: string;
  unit_id: string;
  sku: string;
  price: string;
  stock: string;
}

interface EditVariantFormData {
  name: string;
  unit_id: string;
  sku: string;
  price: string;
  stock: string;
}

// ===================== INITIAL STATE =====================
const initialVariantData: VariantFormData = {
  name: "",
  unit_id: "",
  sku: "",
  price: "",
  stock: "",
};

// ===================== EDIT VARIANT MODAL COMPONENT (UPDATED) =====================
const EditVariantModal = ({
  isOpen,
  onClose,
  variant,
  units,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  variant: ProductVariant | null;
  units: Unit[];
  onSubmit: (data: EditVariantFormData) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [priceMode, setPriceMode] = useState<"set" | "add" | "subtract">("set");

  const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<EditVariantFormData>({
    defaultValues: {
      name: "",
      unit_id: "",
      sku: "",
      price: "",
      stock: "",
    }
  });

  // Watch inputs for real-time calculation
  const watchedPrice = useWatch({ control, name: "price" });
  const watchedStock = useWatch({ control, name: "stock" });

  // Reset form when variant changes
  useEffect(() => {
    if (variant) {
      reset({
        name: variant.name,
        unit_id: variant.unit_id.toString(),
        sku: variant.sku,
        price: variant.price.toString(),
        stock: variant.stock.toString(),
      });
      setPriceMode("set");
    }
  }, [variant, reset]);

  // Helper for Price Mode
  const handlePriceModeChange = (mode: "set" | "add" | "subtract") => {
    setPriceMode(mode);
    setValue("price", mode === "set" ? (variant?.price.toString() || "0") : "");
  };

  // Stock Handlers
  const adjustStock = (amount: number) => {
    const currentVal = parseInt(getValues("stock") || "0");
    const newVal = Math.max(0, currentVal + amount);
    setValue("stock", newVal.toString());
  };

  // Calculate final values
  const calculateFinalValues = () => {
    if (!variant) return { finalPrice: 0, finalStock: 0 };

    // Price Logic
    const inputPrice = parseFloat(watchedPrice) || 0;
    let finalPrice = inputPrice;
    if (priceMode === "add") finalPrice = variant.price + inputPrice;
    if (priceMode === "subtract") finalPrice = Math.max(0, variant.price - inputPrice);

    // Stock Logic
    const finalStock = parseInt(watchedStock) || 0;
    
    // Calculate difference for display
    const stockDifference = finalStock - variant.stock;

    return { finalPrice, finalStock, stockDifference };
  };

  const { finalPrice, finalStock, stockDifference } = calculateFinalValues();

  const handleFormSubmit = async (data: EditVariantFormData) => {
    if (!variant) return;

    // Send the calculated values, keeping original name/unit/sku intact
    const payload = {
      ...data,
      name: variant.name,       // Preserve original name
      unit_id: variant.unit_id.toString(), // Preserve original unit
      sku: variant.sku,         // Preserve original SKU
      price: finalPrice.toString(),
      stock: finalStock.toString()
    };
    await onSubmit(payload);
  };

  if (!isOpen || !variant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl mx-4"
    >
      <div className="bg-white rounded-lg">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">
                <EditIcon className="mr-2" />
                Edit Variant
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {variant.name} ({variant.sku})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            
            {/* Context Info (Read Only) */}
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex gap-4 text-sm text-blue-800">
               <div>
                 <span className="font-semibold text-blue-900">Unit:</span> {variant.unit.name} ({variant.unit.short})
               </div>
               <div>
                 <span className="font-semibold text-blue-900">SKU:</span> {variant.sku}
               </div>
            </div>

            {/* === STOCK EDITING === */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <InventoryIcon className="text-blue-600" />
                <h4 className="font-semibold text-gray-800">Inventory Management</h4>
              </div>
              
              <div className="mb-2">
                 <Label className="text-sm mb-2 block font-medium">
                  Update Stock Level
                 </Label>
                 
                 <div className="flex items-stretch gap-0">
                    {/* Decrement Button */}
                    <button
                      type="button"
                      onClick={() => adjustStock(-1)}
                      className="px-4 py-2 bg-red-100 text-red-700 border border-r-0 border-red-300 rounded-l-md hover:bg-red-200 transition-colors font-bold text-lg"
                      disabled={isSubmitting}
                    >
                      <RemoveIcon fontSize="small" />
                    </button>

                    {/* Input Field */}
                    <div className="flex-1">
                      <Controller
                        name="stock"
                        control={control}
                        rules={{ required: "Required", min: 0 }}
                        render={({ field }) => (
                          <input 
                            {...field} 
                            type="number" 
                            min="0"
                            className="w-full h-full text-center border-y border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-800 text-lg"
                            placeholder="0"
                          />
                        )}
                      />
                    </div>

                    {/* Increment Button */}
                    <button
                      type="button"
                      onClick={() => adjustStock(1)}
                      className="px-4 py-2 bg-green-100 text-green-700 border border-l-0 border-green-300 rounded-r-md hover:bg-green-200 transition-colors font-bold text-lg"
                      disabled={isSubmitting}
                    >
                      <AddIcon fontSize="small" />
                    </button>
                 </div>
              </div>

              {/* Stock Difference Indicator */}
              <div className="flex justify-between items-center mt-3 text-sm">
                 <span className="text-gray-500">Original Stock: {variant.stock}</span>
                 {stockDifference !== 0 && (
                   <span className={`font-medium px-2 py-0.5 rounded ${
                     stockDifference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {stockDifference > 0 ? '+' : ''}{stockDifference} Adjusted
                   </span>
                 )}
              </div>
            </div>

            {/* === PRICE EDITING === */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <LocalOfferIcon className="text-green-600" />
                <h4 className="font-semibold text-gray-800">Price Management</h4>
              </div>
              
              <div className="flex items-center justify-between bg-white p-3 rounded border mb-3">
                <span className="text-sm text-gray-500">Current Price:</span>
                <span className="text-lg font-bold text-gray-800">${variant.price.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="col-span-1">
                  <Label className="text-xs mb-1 block">Operation</Label>
                  <select 
                    value={priceMode}
                    onChange={(e) => handlePriceModeChange(e.target.value as any)}
                    className="w-full p-2 text-sm border rounded bg-white"
                  >
                    <option value="set">Set To</option>
                    <option value="add">Increase By (+)</option>
                    <option value="subtract">Decrease By (-)</option>
                  </select>
                </div>
                <div className="col-span-2">
                   <Label className="text-xs mb-1 block">
                    {priceMode === 'set' ? 'New Price' : 'Adjustment Amount'}
                   </Label>
                   <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Required", min: 0 }}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Preview Calculation for Price */}
              <div className={`mt-2 p-2 rounded text-sm flex justify-between items-center ${
                priceMode === 'set' ? 'bg-gray-100 text-gray-600' : 
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                <span>Resulting Price:</span>
                <div className="flex items-center gap-2 font-bold">
                  ${variant.price.toFixed(2)}
                  <ArrowIcon fontSize="small" className="text-gray-400" />
                  <span className="text-lg">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon fontSize="small" />
                  Update Variant
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// ===================== MAIN COMPONENT =====================
export default function ProductVariantsPage() {
  const params = useParams();

  const { slug } = params;
  const productId = slug;
  
  // State
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<ProductVariant | null>(null);
  const [viewDetailsModal, setViewDetailsModal] = useState<ProductVariant | null>(null);
  const [editModal, setEditModal] = useState<ProductVariant | null>(null);
  
  // Add Variant Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantFormData, setVariantFormData] = useState<VariantFormData>(initialVariantData);

  // ===================== FETCH DATA =====================
  const fetchVariants = async () => {
    const loadingToast = toast.loading("Loading product variants...", {
      duration: 0,
      position: "top-center",
    });

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8030/api/products/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
      }

      const result: VariantListResponse = await response.json();
      const variantsData = result.data?.data || [];

      setVariants(variantsData);

      toast.dismiss(loadingToast);
      toast.success(`Loaded ${variantsData.length} variant(s)`, {
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Variants fetch error:", error);
      toast.dismiss(loadingToast);

      let errorMessage = "Failed to load variants. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(`Load Failed: ${errorMessage}`, {
        duration: 6000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnits = async () => {
    setIsLoadingUnits(true);
    try {
      const response = await fetch("http://localhost:8030/api/units", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch units");
      }

      const result: UnitApiResponse = await response.json();
      const unitsData = result.data?.data || [];
      setUnits(unitsData);
    } catch (error) {
      console.error("Units fetch error:", error);
      toast.error("Failed to load units", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsLoadingUnits(false);
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchUnits();
  }, []);

  // ===================== ADD VARIANT FUNCTIONS =====================
  const handleVariantFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVariantFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateVariantForm = (): boolean => {
    if (!variantFormData.name.trim()) {
      toast.error("Variant name is required!");
      return false;
    }
    if (!variantFormData.sku.trim()) {
      toast.error("SKU is required!");
      return false;
    }
    if (!variantFormData.price || parseFloat(variantFormData.price) <= 0) {
      toast.error("Valid price is required!");
      return false;
    }
    if (!variantFormData.stock || parseInt(variantFormData.stock) < 0) {
      toast.error("Valid stock quantity is required!");
      return false;
    }
    if (!variantFormData.unit_id) {
      toast.error("Unit is required!");
      return false;
    }
    return true;
  };

  const handleCreateVariant = async () => {
    if (!validateVariantForm()) return;

    const loadingToast = toast.loading("Creating variant...", {
      position: "top-center",
    });

    setIsSubmitting(true);

    try {
      const payload = {
        product_id: productId,
        name: variantFormData.name,
        unit_id: parseInt(variantFormData.unit_id),
        sku: variantFormData.sku,
        price: parseFloat(variantFormData.price),
        stock: parseInt(variantFormData.stock),
      };

      const response = await fetch(
        "http://localhost:8030/api/products/productvariant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(
          `SKU "${variantFormData.sku}" already exists. Please use a unique SKU.`,
          {
            position: "top-center",
            duration: 5000,
          }
        );
        setShowAddModal(false);
        setIsSubmitting(false);
        return;
      }

      const createdVariant = result.data?.data;

      toast.dismiss(loadingToast);
      toast.success(`Variant "${createdVariant?.name}" created successfully!`, {
        position: "top-center",
        duration: 5000,
      });

      setVariantFormData(initialVariantData);
      setShowAddModal(false);
      fetchVariants();

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAddVariant = () => {
    setVariantFormData(initialVariantData);
    setShowAddModal(false);
    toast.error("Variant creation cancelled", {
      duration: 2000,
      position: "top-center",
    });
  };

  // ===================== EDIT VARIANT FUNCTION =====================
  const handleEditVariant = async (data: EditVariantFormData) => {
    if (!editModal) return;

    const loadingToast = toast.loading("Updating variant...", {
      position: "top-center",
    });

    setIsSubmitting(true);

    try {
      // NOTE: 'data' now comes with the FINAL calculated price/stock
      // from the EditVariantModal.
      const payload = {
        name: data.name,
        unit_id: parseInt(data.unit_id),
        sku: data.sku,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
      };

      const response = await fetch(
        `http://localhost:8030/api/products/productvariant/${editModal.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update variant");
        setIsSubmitting(false);
        toast.dismiss(loadingToast);
        return;
      }

      // Update local state with the new values
      setVariants(prev => prev.map(variant => 
        variant.id === editModal.id 
          ? { 
              ...variant, 
              name: payload.name,
              unit_id: payload.unit_id,
              sku: payload.sku,
              price: payload.price,
              stock: payload.stock,
              unit: units.find(u => u.unit_id === payload.unit_id) || variant.unit
            }
          : variant
      ));

      toast.dismiss(loadingToast);
      toast.success("Variant updated successfully!", {
        duration: 3000,
        position: "top-center",
      });

      setEditModal(null);
    } catch (error) {
      console.error("Edit variant error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== DELETE VARIANT FUNCTION =====================
  const handleDeleteVariant = async () => {
    if (!deleteModal) return;

    const loadingToast = toast.loading(`Deleting "${deleteModal.name}"...`, {
      position: "top-center",
    });

    try {
      const response = await fetch(
        `http://localhost:8030/api/products/${deleteModal.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(
          `${result.message || "Failed to delete variant"}`,
          {
            duration: 5000,
            position: "top-center",
          }
        );
        return;
      }
      
      toast.dismiss(loadingToast);
      toast.success(`Variant "${deleteModal.name}" deleted successfully!`, {
        duration: 3000,
        position: "top-center",
      });

      // Optimistically update the UI
      setVariants(variants.filter((v) => v.id !== deleteModal.id));
      setDeleteModal(null);
      
    } catch (error) {
      console.error("Delete variant error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  // ===================== REFRESH FUNCTION =====================
  const handleRefresh = () => {
    fetchVariants();
  };

  // ===================== TABLE COLUMNS =====================
  const columns = [
    {
      key: "name",
      label: "Variant Name",
      render: (row: ProductVariant) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">SKU: {row.sku}</div>
        </div>
      ),
    },
    {
      key: "product",
      label: "Product",
      render: (row: ProductVariant) => (
        <div>
          <div className="font-medium text-gray-900">{row.product.name}</div>
          <div className="text-xs text-gray-500">Product SKU: {row.product.sku}</div>
        </div>
      ),
    },
    {
      key: "unit",
      label: "Unit",
      render: (row: ProductVariant) => (
        <Badge size="sm" color="info">
          {row.unit.name} ({row.unit.short})
        </Badge>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: ProductVariant) => (
        <span className="font-semibold text-green-600">
          ${row.price.toFixed(2)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row: ProductVariant) => (
        <div>
          <div
            className={`font-medium ${
              row.stock > 20
                ? "text-green-600"
                : row.stock > 0
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {row.stock} units
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: ProductVariant) => (
        <div className="flex flex-col gap-1">
          {row.product.isVisible && (
            <Badge size="sm" color="success">
              Visible
            </Badge>
          )}
          {row.product.isFeatured && (
            <Badge size="sm" color="warning">
              Featured
            </Badge>
          )}
          {row.product.isPerishable && (
            <Badge size="sm" color="danger">
              Perishable
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ProductVariant) => (
        <div className="flex gap-2">
          <button
            onClick={() => setViewDetailsModal(row)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium border border-blue-200"
          >
            <VisibilityIcon fontSize="small" />
            View
          </button>
          <button
            onClick={() => setEditModal(row)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors font-medium border border-green-200"
          >
            <EditIcon fontSize="small" />
            Edit
          </button>
          <button
            onClick={() => setDeleteModal(row)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium border border-red-200"
          >
            <DeleteIcon fontSize="small" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ===================== RENDER =====================
  return (
    <div className="p-6">
      {/* Top Action Bar */}
      <div className="mb-6 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Product Variants
            </h2>
            <p className="text-sm text-gray-600">
              Product ID: <span className="font-mono font-semibold">{productId}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total Variants: <span className="font-semibold">{variants.length}</span> • 
              Units Available: <span className="font-semibold">{units.length}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="px-4 py-2 font-semibold flex items-center gap-2"
            >
              <RefreshIcon />
              Refresh
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Add Variant
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading variants...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Error Loading Variants
          </h3>
          <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
          <Button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Variants Table */}
      {!isLoading && !error && (
        <>
          {variants.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {column.render(variant)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Variants Found
              </h3>
              <p className="text-gray-600 mb-6">
                This product doesn't have any variants yet. Add your first variant!
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold"
              >
                Add First Variant
              </Button>
            </div>
          )}
        </>
      )}

      {/* ===================== ADD VARIANT MODAL ===================== */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={handleCancelAddVariant}
          className="max-w-lg mx-4"
        >
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Add New Variant
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    Create a new variant for this product
                  </p>
                </div>
                <button
                  onClick={handleCancelAddVariant}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors text-2xl font-bold"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-1">
                    Variant Details
                  </h4>
                  <p className="text-sm text-blue-700">
                    Fill in the details for your new variant
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    Variant Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="name"
                    value={variantFormData.name}
                    onChange={handleVariantFormChange}
                    placeholder="e.g., 2kg, Large, Blue"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="sku"
                    value={variantFormData.sku}
                    onChange={handleVariantFormChange}
                    placeholder="e.g., VARIANT-001"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <select
                    name="unit_id"
                    value={variantFormData.unit_id}
                    onChange={handleVariantFormChange}
                    className="w-full p-3 text-sm border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting || isLoadingUnits}
                  >
                    <option value="">
                      {isLoadingUnits ? "Loading units..." : "Select a unit"}
                    </option>
                    {units.map((unit) => (
                      <option key={unit.unit_id} value={unit.unit_id}>
                        {unit.name} ({unit.short})
                      </option>
                    ))}
                  </select>
                  {units.length === 0 && !isLoadingUnits && (
                    <p className="text-xs text-orange-600 mt-1">
                      No units available. Please add units first.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1 block">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="price"
                      value={variantFormData.price}
                      onChange={handleVariantFormChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1 block">
                      Stock <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="stock"
                      value={variantFormData.stock}
                      onChange={handleVariantFormChange}
                      placeholder="0"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Product:</span>{" "}
                    {variants.length > 0 ? variants[0].product.name : "Loading..."}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Product ID:</span> {productId}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                onClick={handleCancelAddVariant}
                variant="outline"
                disabled={isSubmitting}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateVariant}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Creating...
                  </>
                ) : (
                  "Create Variant"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== EDIT VARIANT MODAL ===================== */}
      <EditVariantModal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        variant={editModal}
        units={units}
        onSubmit={handleEditVariant}
        isSubmitting={isSubmitting}
      />

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {deleteModal && (
        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          className="max-w-md mx-4"
        >
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <DeleteIcon className="text-red-600" fontSize="large" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Delete Variant
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Confirm deletion of this variant
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {deleteModal.name}
                  </h4>
                  <p className="text-sm text-gray-500">SKU: {deleteModal.sku}</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700 font-medium">
                    Warning: This action cannot be undone. The variant will be permanently deleted.
                  </p>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Price:</span> ${deleteModal.price.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Stock:</span> {deleteModal.stock} units
                    </div>
                    <div>
                      <span className="font-medium">Unit:</span> {deleteModal.unit.name}
                    </div>
                    <div>
                      <span className="font-medium">Product:</span> {deleteModal.product.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                onClick={() => setDeleteModal(null)}
                variant="outline"
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteVariant}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 flex items-center gap-2"
              >
                <DeleteIcon fontSize="small" />
                Delete Variant
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== VARIANT DETAILS MODAL ===================== */}
      {viewDetailsModal && (
        <Modal
          isOpen={!!viewDetailsModal}
          onClose={() => setViewDetailsModal(null)}
          className="max-w-4xl mx-4"
        >
          <div className="bg-white rounded-lg max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {viewDetailsModal.name}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    SKU: {viewDetailsModal.sku} • Variant ID: {viewDetailsModal.variant_id}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge size="sm" color="info">
                      {viewDetailsModal.unit.name} ({viewDetailsModal.unit.short})
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setViewDetailsModal(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors text-2xl font-bold ml-4"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                  <h4 className="font-semibold text-lg border-b border-blue-300 pb-2 mb-4 text-gray-800">
                    Variant Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Variant ID:
                      </span>
                      <span className="text-gray-600">
                        {viewDetailsModal.variant_id}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Price:
                      </span>
                      <span className="text-green-600 font-semibold text-lg">
                        ${viewDetailsModal.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Stock:
                      </span>
                      <span
                        className={`font-semibold ${
                          viewDetailsModal.stock > 20
                            ? "text-green-600"
                            : viewDetailsModal.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {viewDetailsModal.stock} units
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Unit:
                      </span>
                      <span className="text-gray-600">
                        {viewDetailsModal.unit.name} ({viewDetailsModal.unit.short})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                  <h4 className="font-semibold text-lg border-b border-green-300 pb-2 mb-4 text-gray-800">
                    Product Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Product Name:
                      </span>
                      <span className="text-gray-600 font-medium">
                        {viewDetailsModal.product.name}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Product SKU:
                      </span>
                      <span className="text-gray-600">
                        {viewDetailsModal.product.sku}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Product Price:
                      </span>
                      <span className="text-green-600 font-semibold">
                        ${viewDetailsModal.product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <span className="font-medium text-gray-700 block mb-1">
                        Product Stock:
                      </span>
                      <span className="text-gray-600">
                        {viewDetailsModal.product.stock} units
                      </span>
                    </div>
                  </div>
                  
                  {viewDetailsModal.product.description && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
                      <span className="font-medium text-gray-700 block mb-2">
                        Description:
                      </span>
                      <p className="text-sm text-gray-600">
                        {viewDetailsModal.product.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Information */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-200">
                  <h4 className="font-semibold text-lg border-b border-yellow-300 pb-2 mb-4 text-gray-800">
                    Status Information
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewDetailsModal.product.isVisible && (
                      <Badge size="sm" color="success">
                        Visible
                      </Badge>
                    )}
                    {viewDetailsModal.product.isFeatured && (
                      <Badge size="sm" color="warning">
                        Featured
                      </Badge>
                    )}
                    {viewDetailsModal.product.isPerishable && (
                      <Badge size="sm" color="danger">
                        Perishable
                      </Badge>
                    )}
                    <Badge size="sm" color={
                      viewDetailsModal.product.inStock === "AVILABLE" ? "success" : "danger"
                    }>
                      {viewDetailsModal.product.inStock}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(viewDetailsModal, null, 2)
                  );
                  toast.success("Variant data copied to clipboard!", {
                    duration: 2000,
                    position: "top-center",
                  });
                }}
                variant="outline"
              >
                Copy JSON
              </Button>
              <Button
                onClick={() => setViewDetailsModal(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}