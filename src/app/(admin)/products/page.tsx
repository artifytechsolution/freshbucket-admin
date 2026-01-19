// "use client";

// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import Badge from "@/components/ui/badge/Badge";
// import Button from "@/components/ui/button/Button";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import { Modal } from "@/components/ui/modal";

// // ===================== INTERFACES (UNCHANGED) =====================
// interface ProductImage {
//   id: number;
//   product_id: number;
//   url: string;
//   altText: string;
//   isPrimary: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Category {
//   id: string;
//   category_id: number;
//   name: string;
//   slug: string | null;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Unit {
//   unit_id: number;
//   name: string;
//   short: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Product {
//   id: string;
//   product_id: number;
//   name: string;
//   slug: string | null;
//   description: string;
//   sku: string;
//   price: number;
//   stock: number;
//   isVisible: boolean;
//   isFeatured: boolean;
//   isPerishable: boolean;
//   expiryDays: number;
//   inStock: string;
//   category_id: number;
//   unit_id: number;
//   createdAt: string;
//   updatedAt: string;
//   reviews: any[];
//   category: Category;
//   images: ProductImage[];
// }

// interface ApiResponse {
//   status: string;
//   data: {
//     status: string;
//     page: number;
//     limit: number;
//     data: Product[];
//   };
//   message: string;
// }

// interface ProductCreateResponse {
//   status: string;
//   data: {
//     data: Product;
//   };
//   message: string;
// }

// interface CategoryApiResponse {
//   status: string;
//   data: {
//     data: Category[];
//     total: number;
//   };
//   message: string;
// }

// interface UnitApiResponse {
//   status: string;
//   data: {
//     data: Unit[];
//     total: number;
//   };
//   message: string;
// }

// interface ProductFormData {
//   name: string;
//   description: string;
//   sku: string;
//   price: number | string;
//   stock: number | string;
//   isVisible: boolean;
//   isFeatured: boolean;
//   isPerishable: boolean;
//   inStock: string;
//   expiryDays: number | string;
//   category_id: number | string;
//   unit_id: number | string;
// }

// interface VariantFormData {
//   name: string;
//   unit_id: number | string;
//   sku: string;
//   price: number | string;
//   stock: number | string;
// }

// interface ImagePreview {
//   file: File;
//   preview: string;
// }

// // ===================== INITIAL STATES (UNCHANGED) =====================
// const initialProductData: ProductFormData = {
//   name: "",
//   description: "",
//   sku: "",
//   price: "",
//   stock: "",
//   isVisible: true,
//   isFeatured: false,
//   isPerishable: false,
//   inStock: "AVILABLE",
//   expiryDays: "",
//   category_id: "",
//   unit_id: "",
// };

// const initialVariantData: VariantFormData = {
//   name: "",
//   unit_id: "",
//   sku: "",
//   price: "",
//   stock: "",
// };

// // ===================== MAIN COMPONENT =====================
// export default function ProductsDisplayPage() {
//   // Product List States
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [viewDetailsModal, setViewDetailsModal] = useState<Product | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   // Categories and Units States
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [isFetchingCategories, setIsFetchingCategories] = useState(false);
//   const [isFetchingUnits, setIsFetchingUnits] = useState(false);

//   // Add Product Modal States
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Step 1: Product Data
//   const [productData, setProductData] = useState<ProductFormData>(initialProductData);
//   const [createdProductId, setCreatedProductId] = useState<string>("");

//   // Step 2: Variants
//   const [variants, setVariants] = useState<VariantFormData[]>([initialVariantData]);

//   // Step 3: Images
//   const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

//   // ===================== FETCH CATEGORIES AND UNITS =====================
//   const fetchCategories = async () => {
//     setIsFetchingCategories(true);
//     try {
//       const response = await fetch("http://localhost:8030/api/categories", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//        toast.error("Failed to fetch categories");
//       }

//       const result: CategoryApiResponse = await response.json();
//       const categoriesData = result.data?.data || [];
//       setCategories(categoriesData);
//     } catch (error) {
//       console.error("❌ Categories fetch error:", error);
//       toast.error("Failed to load categories");
//     } finally {
//       setIsFetchingCategories(false);
//     }
//   };

//   const fetchUnits = async () => {
//     setIsFetchingUnits(true);
//     try {
//       const response = await fetch("http://localhost:8030/api/units", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         toast.error("Failed to fetch units");
//       }

//       const result: UnitApiResponse = await response.json();
//       const unitsData = result.data?.data || [];
//       setUnits(unitsData);
//     } catch (error) {
//       console.error("❌ Units fetch error:", error);
//       toast.error("Failed to load units");
//     } finally {
//       setIsFetchingUnits(false);
//     }
//   };

//   // ===================== PRODUCT LIST FUNCTIONS =====================
//   const fetchProducts = async (page: number = 1) => {
//     const loadingToast = toast.loading("Loading products...", {
//       duration: 0,
//       position: "top-center",
//     });

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `http://localhost:8030/api/products?page=${page}&limit=${limit}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         toast.error(`HTTP error! status: ${response.status}`);
//       }

//       const result: ApiResponse = await response.json();
//       const productsData = result.data?.data?.data || [];
//       const pageNumber = result.data?.page || 1;
//       const limitNumber = result.data?.limit || 10;

//       setProducts(productsData);
//       setCurrentPage(pageNumber);
//       setLimit(limitNumber);

//       toast.dismiss(loadingToast);
//       toast.success(`Loaded ${productsData.length} products`, {
//         duration: 2000,
//         position: "top-center",
//       });
//     } catch (error) {
//       console.error("❌ Products fetch error:", error);
//       toast.dismiss(loadingToast);

//       let errorMessage = "Failed to load products.";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(1);
//     fetchCategories();
//     fetchUnits();
//   }, []);

//   const handleViewDetails = (product: Product) => {
//     setViewDetailsModal(product);
//   };

//   const handleRefresh = () => {
//     fetchProducts(currentPage);
//     fetchCategories();
//     fetchUnits();
//   };

//   // ===================== DELETE PRODUCT FUNCTION =====================
//   const handleDeleteProduct = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
//       return;
//     }

//     const loadingToast = toast.loading("Deleting product...", {
//       position: "top-center"
//     });

//     try {
//       const response = await fetch(`http://localhost:8030/api/products/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         toast.error("Failed to delete product");
//       }

//       // Optimistically remove from UI
//       setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));

//       toast.dismiss(loadingToast);
//       toast.success("Product deleted successfully", {
//         position: "top-center",
//         duration: 3000
//       });

//     } catch (error) {
//       console.error("❌ Delete error:", error);
//       toast.dismiss(loadingToast);
//       toast.error("Failed to delete product. Please try again.", {
//         position: "top-center"
//       });
//     }
//   };

//   const getPrimaryImage = (images: ProductImage[]) => {
//     const primaryImage = images.find((img) => img.isPrimary);
//     return (
//       primaryImage?.url ||
//       images[0]?.url ||
//       "https://via.placeholder.com/80?text=No+Image"
//     );
//   };

//   // ===================== ADD PRODUCT MODAL FUNCTIONS =====================

//   // Step 1: Product Handlers
//   const handleProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (type === "checkbox") {
//       const checked = (e.target as HTMLInputElement).checked;
//       setProductData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setProductData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateProductData = (): boolean => {
//     if (!productData.name.trim()) {
//       toast.error("Product name is required");
//       return false;
//     }
//     if (!productData.sku.trim()) {
//       toast.error("SKU is required");
//       return false;
//     }
//     if (!productData.price || parseFloat(productData.price.toString()) <= 0) {
//       toast.error("Valid price is required");
//       return false;
//     }
//     if (!productData.stock || parseInt(productData.stock.toString()) < 0) {
//       toast.error("Valid stock quantity is required");
//       return false;
//     }
//     if (!productData.category_id) {
//       toast.error("Category is required");
//       return false;
//     }
//     if (!productData.unit_id) {
//       toast.error("Unit is required");
//       return false;
//     }
//     return true;
//   };

//   const handleCreateProduct = async () => {
//     if (!validateProductData()) return;

//     const loadingToast = toast.loading("Creating product...", {
//       position: "top-center",
//     });

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         ...productData,
//         price: parseFloat(productData.price.toString()),
//         stock: parseInt(productData.stock.toString()),
//         expiryDays: productData.expiryDays
//           ? parseInt(productData.expiryDays.toString())
//           : 0,
//         category_id: parseInt(productData.category_id.toString()),
//         unit_id: parseInt(productData.unit_id.toString()),
//       };

//       const response = await fetch("http://localhost:8030/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to create product");
//       }

//       const result: ProductCreateResponse = await response.json();
//       const createdProduct = result.data?.data;

//       if (!createdProduct || !createdProduct.id) {
//         toast.error("Product ID not returned from API");
//       }

//       const productId = createdProduct.id;
//       setCreatedProductId(productId);

//       toast.dismiss(loadingToast);
//       toast.success(`Created "${createdProduct.name}"`, {
//         duration: 3000,
//         position: "top-center",
//       });

//       setCurrentStep(2);
//     } catch (error) {
//       console.error("❌ Product creation error:", error);
//       toast.dismiss(loadingToast);
//       toast.error(
//         `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//         {
//           duration: 5000,
//           position: "top-center",
//         }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Step 2: Variant Handlers
//   const handleVariantChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     const updatedVariants = [...variants];
//     updatedVariants[index] = { ...updatedVariants[index], [name]: value };
//     setVariants(updatedVariants);
//   };

//   const addVariant = () => {
//     setVariants([...variants, { ...initialVariantData }]);
//   };

//   const removeVariant = (index: number) => {
//     if (variants.length === 1) {
//       toast.error("At least one variant is required");
//       return;
//     }
//     const updatedVariants = variants.filter((_, i) => i !== index);
//     setVariants(updatedVariants);
//   };

//   const validateVariants = (): boolean => {
//     for (let i = 0; i < variants.length; i++) {
//       const variant = variants[i];
//       if (!variant.name.trim()) {
//         toast.error(`Variant ${i + 1}: Name is required`);
//         return false;
//       }
//       if (!variant.sku.trim()) {
//         toast.error(`Variant ${i + 1}: SKU is required`);
//         return false;
//       }
//       if (!variant.price || parseFloat(variant.price.toString()) <= 0) {
//         toast.error(`Variant ${i + 1}: Valid price is required`);
//         return false;
//       }
//       if (!variant.stock || parseInt(variant.stock.toString()) < 0) {
//         toast.error(`Variant ${i + 1}: Valid stock is required`);
//         return false;
//       }
//       if (!variant.unit_id) {
//         toast.error(`Variant ${i + 1}: Unit is required`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleCreateVariants = async () => {
//     if (!validateVariants()) return;

//     const loadingToast = toast.loading("Creating variants...", {
//       position: "top-center",
//     });

//     setIsSubmitting(true);

//     try {
//       const variantPromises = variants.map(async (variant) => {
//         const payload = {
//           product_id: createdProductId,
//           name: variant.name,
//           unit_id: parseInt(variant.unit_id.toString()),
//           sku: variant.sku,
//           price: parseFloat(variant.price.toString()),
//           stock: parseInt(variant.stock.toString()),
//         };

//         const response = await fetch(
//           "http://localhost:8030/api/products/productvariant",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           toast.error(errorData.message || "Failed to create variant");
//         }

//         return await response.json();
//       });

//       await Promise.all(variantPromises);

//       toast.dismiss(loadingToast);
//       toast.success(`Created ${variants.length} variant(s)`, {
//         duration: 3000,
//         position: "top-center",
//       });

//       setCurrentStep(3);
//     } catch (error) {
//       console.error("❌ Variant creation error:", error);
//       toast.dismiss(loadingToast);
//       toast.error(
//         `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//         {
//           duration: 5000,
//           position: "top-center",
//         }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkipVariants = () => {
//     setCurrentStep(3);
//   };

//   // Step 3: Image Handlers
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const newImages: ImagePreview[] = [];

//     Array.from(files).forEach((file) => {
//       if (!file.type.startsWith("image/")) {
//         toast.error(`${file.name} is not an image file`);
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name} is too large (max 5MB)`);
//         return;
//       }

//       const preview = URL.createObjectURL(file);
//       newImages.push({ file, preview });
//     });

//     setSelectedImages((prev) => [...prev, ...newImages]);
//     toast.success(`${newImages.length} image(s) added`);
//   };

//   const removeImage = (index: number) => {
//     setSelectedImages((prev) => {
//       const updated = prev.filter((_, i) => i !== index);
//       URL.revokeObjectURL(prev[index].preview);
//       return updated;
//     });
//   };

//   const handleUploadImages = async () => {
//     if (selectedImages.length === 0) {
//       toast.error("Please select at least one image");
//       return;
//     }

//     const loadingToast = toast.loading(
//       `Uploading ${selectedImages.length} image(s)...`,
//       {
//         position: "top-center",
//       }
//     );

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("product_id", createdProductId);

//       selectedImages.forEach((img) => {
//         formData.append("images", img.file);
//       });

//       const response = await fetch(
//         "http://localhost:8030/api/products/images/upload/multiple",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to upload images");
//       }

//       toast.dismiss(loadingToast);
//       toast.success(
//         `Product created successfully!`,
//         {
//           duration: 4000,
//           position: "top-center",
//         }
//       );

//       setTimeout(() => {
//         handleCompleteAddProduct();
//       }, 1000);
//     } catch (error) {
//       console.error("❌ Image upload error:", error);
//       toast.dismiss(loadingToast);
//       toast.error(
//         `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//         {
//           duration: 5000,
//           position: "top-center",
//         }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkipImages = () => {
//     handleCompleteAddProduct();
//   };

//   // Completion Handler
//   const handleCompleteAddProduct = () => {
//     selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));

//     setCurrentStep(1);
//     setProductData(initialProductData);
//     setCreatedProductId("");
//     setVariants([initialVariantData]);
//     setSelectedImages([]);
//     setShowAddModal(false);

//     fetchProducts(currentPage);
//   };

//   // Navigation Handlers
//   const handleBackStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleCancelAddProduct = () => {
//     if (
//       window.confirm(
//         "Are you sure you want to cancel? All unsaved data will be lost."
//       )
//     ) {
//       selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));

//       setCurrentStep(1);
//       setProductData(initialProductData);
//       setCreatedProductId("");
//       setVariants([initialVariantData]);
//       setSelectedImages([]);
//       setShowAddModal(false);
//     }
//   };

//   // ===================== TABLE COLUMNS (WITH DELETE) =====================
//   const columns = [
//     {
//       key: "image",
//       label: "Product",
//       render: (row: Product) => (
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
//             <img
//               src={getPrimaryImage(row.images)}
//               alt={row.name}
//               className="h-full w-full object-cover"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src =
//                   "https://via.placeholder.com/80?text=No+Image";
//               }}
//             />
//           </div>
//           <div>
//             <div className="font-medium text-gray-900 text-sm">{row.name}</div>
//             <div className="text-xs text-gray-500 font-mono">{row.sku}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "category",
//       label: "Category",
//       render: (row: Product) => (
//          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//           {row.category ? row.category.name : "Uncategorized"}
//         </span>
//       ),
//     },
//     {
//       key: "price",
//       label: "Price",
//       render: (row: Product) => (
//         <span className="font-medium text-gray-900 text-sm">
//           ${row.price.toFixed(2)}
//         </span>
//       ),
//     },
//     {
//       key: "stock",
//       label: "Stock Status",
//       render: (row: Product) => (
//         <div className="flex flex-col">
//             <span className={`text-xs font-semibold ${row.stock > 0 ? "text-gray-900" : "text-red-600"}`}>
//                 {row.stock} units
//             </span>
//             <div className="flex items-center gap-1.5 mt-0.5">
//                 <div className={`w-1.5 h-1.5 rounded-full ${row.inStock === "AVILABLE" ? "bg-green-500" : "bg-red-500"}`}></div>
//                 <span className="text-[10px] text-gray-500 uppercase tracking-wide">
//                     {row.inStock === "AVILABLE" ? "In Stock" : "Out of Stock"}
//                 </span>
//             </div>
//         </div>
//       ),
//     },
//     {
//       key: "status",
//       label: "Tags",
//       render: (row: Product) => (
//         <div className="flex flex-wrap gap-1">
//           {row.isVisible && (
//             <span className="px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-medium">
//               Visible
//             </span>
//           )}
//           {row.isFeatured && (
//             <span className="px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-medium">
//               Featured
//             </span>
//           )}
//           {row.isPerishable && (
//             <span className="px-1.5 py-0.5 rounded border border-red-200 bg-red-50 text-red-700 text-[10px] font-medium">
//               Perishable
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       key: "actions",
//       label: "",
//       render: (row: Product) => (
//         <div className="flex justify-end items-center gap-3">
//           <button
//             onClick={() => handleViewDetails(row)}
//             className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
//             title="View Details"
//           >
//             Details
//           </button>
//           <button
//             onClick={() => handleDeleteProduct(row.id)}
//             className="text-red-400 hover:text-red-700 transition-colors text-sm font-medium"
//             title="Delete Product"
//           >
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // ===================== RENDER =====================
//   return (
//     <React.Fragment>
//       <PageBreadcrumb pageTitle="Inventory" />

//       {/* Minimal Header */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//         <div>
//            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
//            <p className="text-gray-500 text-sm mt-1">
//              Manage your product catalog, prices, and stock levels.
//            </p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             onClick={handleRefresh}
//             variant="outline"
//             className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium h-10 px-4"
//           >
//             Refresh
//           </Button>
//           <Button
//             onClick={() => setShowAddModal(true)}
//             className="bg-gray-900 hover:bg-black text-white shadow-sm hover:shadow transition-all font-medium h-10 px-4 flex items-center gap-2"
//           >
//             <span>+</span> Add Product
//           </Button>
//         </div>
//       </div>

//       {/* Stats Row (Minimal) */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</span>
//             <div className="text-2xl font-bold text-gray-900 mt-1">{products.length}</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</span>
//             <div className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Units</span>
//             <div className="text-2xl font-bold text-gray-900 mt-1">{units.length}</div>
//         </div>
//       </div>

//       <ComponentCard className="!p-0 !border-0 !shadow-none !bg-transparent">
//         {/* Loading State */}
//         {isLoading && (
//           <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mb-4"></div>
//             <p className="text-gray-500 text-sm font-medium">Syncing data...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className="text-center py-16 bg-red-50/50 rounded-xl border border-red-100">
//             <h3 className="text-sm font-bold text-red-800 mb-1">Error Loading Products</h3>
//             <p className="text-red-600 text-xs mb-4">{error}</p>
//             <Button onClick={handleRefresh} size="sm" className="bg-white border border-red-200 text-red-700 hover:bg-red-50">
//               Try Again
//             </Button>
//           </div>
//         )}

//         {/* Products Table */}
//         {!isLoading && !error && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//             {products.length > 0 ? (
//               <BasicTableOne columns={columns} data={products} />
//             ) : (
//               <div className="text-center py-24">
//                 <div className="text-gray-300 text-4xl mb-3">📦</div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
//                 <p className="text-gray-500 text-sm mb-6">Get started by adding items to your inventory.</p>
//                 <Button onClick={() => setShowAddModal(true)} className="bg-gray-900 text-white">
//                   Add First Product
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}
//       </ComponentCard>

//       {/* ===================== ADD PRODUCT MODAL (MINIMAL) ===================== */}
//       {showAddModal && (
//         <Modal
//           isOpen={showAddModal}
//           onClose={handleCancelAddProduct}
//           className="max-w-3xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
//             {/* Header */}
//             <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900">Add Product</h3>
//               </div>
//               <button
//                 onClick={handleCancelAddProduct}
//                 className="text-gray-400 hover:text-gray-900 text-xl font-light"
//                 disabled={isSubmitting}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Simple Progress Bar */}
//             <div className="w-full bg-gray-100 h-1">
//                 <div 
//                     className="bg-gray-900 h-1 transition-all duration-300 ease-in-out" 
//                     style={{ width: `${(currentStep / 3) * 100}%` }}
//                 ></div>
//             </div>
            
//             <div className="bg-gray-50/50 px-6 py-2 border-b border-gray-100 flex gap-4 text-xs font-medium text-gray-500">
//                 <span className={currentStep === 1 ? "text-gray-900" : ""}>1. Details</span>
//                 <span className="text-gray-300">/</span>
//                 <span className={currentStep === 2 ? "text-gray-900" : ""}>2. Variants</span>
//                 <span className="text-gray-300">/</span>
//                 <span className={currentStep === 3 ? "text-gray-900" : ""}>3. Media</span>
//             </div>

//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//               {/* STEP 1: PRODUCT INFORMATION */}
//               {currentStep === 1 && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
//                         Product Name
//                       </Label>
//                       <Input
//                         name="name"
//                         value={productData.name}
//                         onChange={handleProductChange}
//                         placeholder="e.g. Premium Cotton Shirt"
//                         disabled={isSubmitting}
//                         className="bg-white"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
//                         Description
//                       </Label>
//                       <textarea
//                         name="description"
//                         value={productData.description}
//                         onChange={handleProductChange}
//                         placeholder="Describe your product..."
//                         className="w-full p-3 text-sm border border-gray-200 rounded-lg min-h-[100px] focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">SKU</Label>
//                       <Input
//                         name="sku"
//                         value={productData.sku}
//                         onChange={handleProductChange}
//                         placeholder="PROD-001"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Price ($)</Label>
//                       <Input
//                         type="number"
//                         name="price"
//                         value={productData.price}
//                         onChange={handleProductChange}
//                         placeholder="0.00"
//                         step="0.01"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Stock</Label>
//                       <Input
//                         type="number"
//                         name="stock"
//                         value={productData.stock}
//                         onChange={handleProductChange}
//                         placeholder="0"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Status</Label>
//                       <select
//                         name="inStock"
//                         value={productData.inStock}
//                         onChange={handleProductChange}
//                         className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none"
//                         disabled={isSubmitting}
//                       >
//                         <option value="AVILABLE">In Stock</option>
//                         <option value="OUT_OF_STOCK">Out of Stock</option>
//                       </select>
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Category</Label>
//                       <select
//                         name="category_id"
//                         value={productData.category_id}
//                         onChange={handleProductChange}
//                         className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none"
//                         disabled={isSubmitting || isFetchingCategories}
//                       >
//                         <option value="">Select...</option>
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.category_id}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Unit</Label>
//                       <select
//                         name="unit_id"
//                         value={productData.unit_id}
//                         onChange={handleProductChange}
//                         className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none"
//                         disabled={isSubmitting || isFetchingUnits}
//                       >
//                         <option value="">Select...</option>
//                         {units.map((unit) => (
//                           <option key={unit.unit_id} value={unit.unit_id}>
//                             {unit.name} ({unit.short})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex gap-6 pt-6 border-t border-gray-100">
//                     <label className="flex items-center gap-2 cursor-pointer group">
//                       <input
//                         type="checkbox"
//                         name="isVisible"
//                         checked={productData.isVisible}
//                         onChange={handleProductChange}
//                         className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
//                         disabled={isSubmitting}
//                       />
//                       <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Visible</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer group">
//                       <input
//                         type="checkbox"
//                         name="isFeatured"
//                         checked={productData.isFeatured}
//                         onChange={handleProductChange}
//                         className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
//                         disabled={isSubmitting}
//                       />
//                       <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Featured</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer group">
//                         <input
//                             type="checkbox"
//                             name="isPerishable"
//                             checked={productData.isPerishable}
//                             onChange={handleProductChange}
//                             className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
//                             disabled={isSubmitting}
//                         />
//                         <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Perishable</span>
//                     </label>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2: VARIANTS */}
//               {currentStep === 2 && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <div className="text-sm text-gray-500">Configure product options (Size, Color, etc).</div>
//                     <Button
//                         size="sm"
//                         onClick={addVariant}
//                         variant="outline"
//                         className="text-xs h-8 border-gray-200"
//                         disabled={isSubmitting}
//                       >
//                         + Add Variant
//                     </Button>
//                   </div>

//                   {variants.map((variant, index) => (
//                     <div
//                       key={index}
//                       className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-colors"
//                     >
//                       <div className="flex justify-between items-center mb-3">
//                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                           Variant {index + 1}
//                         </span>
//                         {variants.length > 1 && (
//                           <button
//                             onClick={() => removeVariant(index)}
//                             className="text-red-500 hover:text-red-700 text-xs font-medium"
//                             disabled={isSubmitting}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                         <Input
//                           name="name"
//                           value={variant.name}
//                           onChange={(e) => handleVariantChange(index, e)}
//                           placeholder="Name (e.g. XL)"
//                           className="bg-white h-9 text-sm"
//                           disabled={isSubmitting}
//                         />
//                         <Input
//                           name="sku"
//                           value={variant.sku}
//                           onChange={(e) => handleVariantChange(index, e)}
//                           placeholder="SKU"
//                           className="bg-white h-9 text-sm"
//                           disabled={isSubmitting}
//                         />
//                         <Input
//                           type="number"
//                           name="price"
//                           value={variant.price}
//                           onChange={(e) => handleVariantChange(index, e)}
//                           placeholder="Price"
//                           className="bg-white h-9 text-sm"
//                           disabled={isSubmitting}
//                         />
//                          <Input
//                           type="number"
//                           name="stock"
//                           value={variant.stock}
//                           onChange={(e) => handleVariantChange(index, e)}
//                           placeholder="Stock"
//                           className="bg-white h-9 text-sm"
//                           disabled={isSubmitting}
//                         />
//                         <select
//                             name="unit_id"
//                             value={variant.unit_id}
//                             onChange={(e) => handleVariantChange(index, e)}
//                             className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none"
//                             disabled={isSubmitting || isFetchingUnits}
//                         >
//                             <option value="">Unit</option>
//                             {units.map((unit) => (
//                                 <option key={unit.unit_id} value={unit.unit_id}>
//                                 {unit.short}
//                                 </option>
//                             ))}
//                         </select>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* STEP 3: IMAGES */}
//               {currentStep === 3 && (
//                 <div className="space-y-6">
//                   {/* Upload Area */}
//                   <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer relative group">
//                     <input
//                       type="file"
//                       id="imageUpload"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageSelect}
//                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
//                       disabled={isSubmitting}
//                     />
//                     <div className="text-4xl mb-3 text-gray-300 group-hover:text-gray-500 transition-colors">☁️</div>
//                     <p className="text-sm font-medium text-gray-900">
//                       Click to upload images
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Max 5MB per file.
//                     </p>
//                   </div>

//                   {/* Image Previews */}
//                   {selectedImages.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {selectedImages.map((img, index) => (
//                           <div
//                             key={index}
//                             className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
//                           >
//                             <img
//                               src={img.preview}
//                               alt={`Preview`}
//                               className="w-full h-full object-cover"
//                             />
//                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                                 <button
//                                     onClick={() => removeImage(index)}
//                                     className="bg-white text-black rounded-full px-3 py-1 text-xs font-bold"
//                                     disabled={isSubmitting}
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center rounded-b-xl">
//               <div>
//                 {currentStep > 1 && (
//                   <Button
//                     onClick={handleBackStep}
//                     variant="ghost"
//                     disabled={isSubmitting}
//                     className="text-gray-500 hover:text-gray-900"
//                   >
//                     Back
//                   </Button>
//                 )}
//               </div>
//               <div className="flex gap-3">
//                 {currentStep > 1 && (
//                     <Button
//                         onClick={currentStep === 2 ? handleSkipVariants : handleSkipImages}
//                         variant="ghost"
//                         className="text-gray-400 hover:text-gray-600"
//                         disabled={isSubmitting}
//                     >
//                         Skip
//                     </Button>
//                 )}
                
//                 <Button
//                   onClick={handleCancelAddProduct}
//                   variant="outline"
//                   disabled={isSubmitting}
//                   className="border-gray-200 text-gray-600"
//                 >
//                   Cancel
//                 </Button>

//                 {currentStep === 1 && (
//                   <Button
//                     onClick={handleCreateProduct}
//                     className="bg-gray-900 hover:bg-black text-white px-6"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Saving..." : "Next Step"}
//                   </Button>
//                 )}

//                 {currentStep === 2 && (
//                   <Button
//                     onClick={handleCreateVariants}
//                     className="bg-gray-900 hover:bg-black text-white px-6"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Saving..." : "Next Step"}
//                   </Button>
//                 )}

//                 {currentStep === 3 && (
//                   <Button
//                     onClick={handleUploadImages}
//                     className="bg-gray-900 hover:bg-black text-white px-6"
//                     disabled={isSubmitting || selectedImages.length === 0}
//                   >
//                     {isSubmitting ? "Uploading..." : "Finish"}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* ===================== PRODUCT DETAILS MODAL (MINIMAL) ===================== */}
//       {viewDetailsModal && (
//         <Modal
//           isOpen={!!viewDetailsModal}
//           onClose={() => setViewDetailsModal(null)}
//           className="max-w-4xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             {/* Minimal Header */}
//             <div className="p-6 border-b border-gray-100 flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">
//                     {viewDetailsModal.name}
//                   </h3>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
//                         {viewDetailsModal.sku}
//                     </span>
//                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${viewDetailsModal.inStock === "AVILABLE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
//                         {viewDetailsModal.inStock === "AVILABLE" ? "In Stock" : "Out of Stock"}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setViewDetailsModal(null)}
//                   className="text-gray-400 hover:text-gray-900 text-2xl font-light"
//                 >
//                   ×
//                 </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Left Column */}
//                 <div className="lg:col-span-2 space-y-8">
//                      {/* Images */}
//                      <div>
//                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Gallery</h4>
//                         {viewDetailsModal.images && viewDetailsModal.images.length > 0 ? (
//                             <div className="grid grid-cols-4 gap-3">
//                             {viewDetailsModal.images.map((image: ProductImage) => (
//                                 <div key={image.id} className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
//                                     <img
//                                         src={image.url}
//                                         alt={image.altText}
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </div>
//                             ))}
//                             </div>
//                         ) : (
//                             <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
//                                 No images available
//                             </div>
//                         )}
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
//                         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                             {viewDetailsModal.description || "No description provided."}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right Column (Sidebar) */}
//                 <div className="space-y-6">
//                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
//                         <div className="mb-6">
//                             <label className="text-xs text-gray-500 block mb-1">Price</label>
//                             <div className="text-3xl font-bold text-gray-900">${viewDetailsModal.price.toFixed(2)}</div>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="text-xs text-gray-500 block mb-1">Stock Level</label>
//                                 <div className="font-semibold text-gray-900">{viewDetailsModal.stock} Units</div>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 block mb-1">Category</label>
//                                 <div className="font-semibold text-gray-900">{viewDetailsModal.category?.name || "N/A"}</div>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 block mb-1">Product ID</label>
//                                 <div className="font-mono text-xs text-gray-600">{viewDetailsModal.product_id}</div>
//                             </div>
//                         </div>

//                         <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
//                              <div className="flex justify-between text-sm">
//                                 <span className="text-gray-500">Visible</span>
//                                 <span className="font-medium text-gray-900">{viewDetailsModal.isVisible ? "Yes" : "No"}</span>
//                              </div>
//                              <div className="flex justify-between text-sm">
//                                 <span className="text-gray-500">Featured</span>
//                                 <span className="font-medium text-gray-900">{viewDetailsModal.isFeatured ? "Yes" : "No"}</span>
//                              </div>
//                              <div className="flex justify-between text-sm">
//                                 <span className="text-gray-500">Perishable</span>
//                                 <span className="font-medium text-gray-900">{viewDetailsModal.isPerishable ? "Yes" : "No"}</span>
//                              </div>
//                         </div>
//                     </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3">
//               <Button
//                 onClick={() => {
//                   navigator.clipboard.writeText(JSON.stringify(viewDetailsModal, null, 2));
//                   toast.success("Copied raw JSON");
//                 }}
//                 variant="outline"
//                 className="text-xs h-9"
//               >
//                 Copy JSON
//               </Button>
//               <Button
//                 onClick={() => setViewDetailsModal(null)}
//                 className="bg-gray-900 hover:bg-black text-white h-9 px-6"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </React.Fragment>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Badge from "@/components/ui/badge/Badge"; 
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";

// ===================== INTERFACES =====================
interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  altText: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  category_id: number;
  name: string;
  slug: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

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
  reviews: any[];
  category: Category;
  images: ProductImage[];
}

interface ApiResponse {
  status: string;
  data: {
    status: string;
    page: number;
    limit: number;
    data: Product[];
  };
  message: string;
}

interface ProductCreateResponse {
  status: string;
  data: {
    data: Product;
  };
  message: string;
}

interface CategoryApiResponse {
  status: string;
  data: {
    data: Category[];
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

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number | string;
  stock: number | string;
  isVisible: boolean;
  isFeatured: boolean;
  isPerishable: boolean;
  inStock: string;
  expiryDays: number | string;
  category_id: number | string;
  unit_id: number | string;
}

interface VariantFormData {
  name: string;
  unit_id: number | string;
  sku: string;
  price: number | string;
  stock: number | string;
}

interface ImagePreview {
  file: File;
  preview: string;
}

// ===================== INITIAL STATES =====================
const initialProductData: ProductFormData = {
  name: "",
  description: "",
  sku: "",
  price: "",
  stock: "",
  isVisible: true,
  isFeatured: false,
  isPerishable: false,
  inStock: "AVILABLE",
  expiryDays: "",
  category_id: "",
  unit_id: "",
};

const initialVariantData: VariantFormData = {
  name: "",
  unit_id: "",
  sku: "",
  price: "",
  stock: "",
};

// ===================== HELPER COMPONENTS =====================
const StatCard = ({ label, value, icon }: { label: string; value: number | string; icon?: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
    {icon && <div className="text-gray-200 text-2xl">{icon}</div>}
  </div>
);

// ===================== MAIN COMPONENT =====================
export default function ProductsDisplayPage() {
  const router = useRouter(); 

  // Product List States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewDetailsModal, setViewDetailsModal] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Categories and Units States
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingUnits, setIsFetchingUnits] = useState(false);

  // Add Product Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Product Data
  const [productData, setProductData] = useState<ProductFormData>(initialProductData);
  const [createdProductId, setCreatedProductId] = useState<string>("");

  // Step 2: Variants
  const [variants, setVariants] = useState<VariantFormData[]>([initialVariantData]);

  // Step 3: Images
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

  // ===================== FETCH LOGIC =====================
  const fetchCategories = async () => {
    setIsFetchingCategories(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/categories`, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) toast.error("Failed to fetch categories");
      const result: CategoryApiResponse = await response.json();
      setCategories(result.data?.data || []);
    } catch (error) {
      console.error("❌ Categories fetch error:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const fetchUnits = async () => {
    setIsFetchingUnits(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/units`, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) toast.error("Failed to fetch units");
      const result: UnitApiResponse = await response.json();
      setUnits(result.data?.data || []);
    } catch (error) {
      console.error("❌ Units fetch error:", error);
      toast.error("Failed to load units");
    } finally {
      setIsFetchingUnits(false);
    }
  };

  const fetchProducts = async (page: number = 1) => {
    const loadingToast = toast.loading("Loading products...", { duration: 0, position: "top-center" });
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?page=${page}&limit=${limit}`, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) toast.error(`HTTP error! status: ${response.status}`);
      const result: ApiResponse = await response.json();
      setProducts(result.data?.data?.data || []);
      setCurrentPage(result.data?.page || 1);
      setLimit(result.data?.limit || 10);
      toast.dismiss(loadingToast);
      toast.success(`Loaded ${(result.data?.data?.data || []).length} products`, { duration: 2000, position: "top-center" });
    } catch (error) {
      console.error("❌ Products fetch error:", error);
      toast.dismiss(loadingToast);
      setError(error instanceof Error ? error.message : "Failed to load products.");
      toast.error(error instanceof Error ? error.message : "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchUnits();
  }, []);

  const handleRefresh = () => {
    fetchProducts(currentPage);
    fetchCategories();
    fetchUnits();
  };

  // ===================== ACTION LOGIC =====================
  const handleDeleteProduct = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    const loadingToast = toast.loading("Deleting product...", { position: "top-center" });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/deleteproduct/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
      if (!response.ok) toast.error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.dismiss(loadingToast);
      toast.success("Product deleted successfully", { position: "top-center", duration: 3000 });
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete product.", { position: "top-center" });
    }
  };

  const getPrimaryImage = (images: ProductImage[]) => {
    return images.find((img) => img.isPrimary)?.url || images[0]?.url || "https://via.placeholder.com/80?text=No+Image";
  };

  // ===================== STEP 1: CREATE PRODUCT LOGIC =====================
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setProductData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateProductData = (): boolean => {
    if (!productData.name.trim()) { toast.error("Product name is required"); return false; }
    if (!productData.sku.trim()) { toast.error("SKU is required"); return false; }
    if (!productData.price || parseFloat(productData.price.toString()) <= 0) { toast.error("Valid price is required"); return false; }
    if (!productData.stock || parseInt(productData.stock.toString()) < 0) { toast.error("Valid stock quantity is required"); return false; }
    if (!productData.category_id) { toast.error("Category is required"); return false; }
    if (!productData.unit_id) { toast.error("Unit is required"); return false; }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateProductData()) return;
    const loadingToast = toast.loading("Creating product...", { position: "top-center" });
    setIsSubmitting(true);
    try {
      const payload = {
        ...productData,
        price: parseFloat(productData.price.toString()),
        stock: parseInt(productData.stock.toString()),
        expiryDays: productData.expiryDays ? parseInt(productData.expiryDays.toString()) : 0,
        category_id: parseInt(productData.category_id.toString()),
        unit_id: parseInt(productData.unit_id.toString()),
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) { const errorData = await response.json(); toast.error(errorData.message || "Failed to create product"); }
      const result: ProductCreateResponse = await response.json();
      if (result.data?.data?.id) {
        setCreatedProductId(result.data.data.id);
        toast.dismiss(loadingToast);
        toast.success(`Created "${result.data.data.name}"`, { duration: 3000, position: "top-center" });
        setCurrentStep(2);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`, { duration: 5000, position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== STEP 2: OPTIMIZED VARIANT LOGIC =====================
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setVariants(updatedVariants);
  };

  const addVariant = () => setVariants([...variants, { ...initialVariantData }]);
  
  const removeVariant = (index: number) => {
    if (variants.length === 1) { toast.error("At least one variant is required"); return; }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCreateVariants = async () => {
    // 1. Prevent Double Submission
    if (isSubmitting) return;

    // 2. Validate empty fields
    const hasEmptyFields = variants.some(v => !v.name || !v.sku || !v.price || !v.stock || !v.unit_id);
    if(hasEmptyFields) { 
        toast.error("Please fill all fields for every variant."); 
        return; 
    }

    // 3. Validate Duplicate SKUs locally
    const skus = variants.map(v => v.sku.trim().toLowerCase());
    const uniqueSkus = new Set(skus);
    if(uniqueSkus.size !== skus.length) {
        toast.error("Duplicate SKUs detected inside this list. SKUs must be unique.");
        return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Saving variants...", { position: "top-center" });

    try {
      // 4. Create Array of Promises
      const variantRequests = variants.map((variant) => {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/productvariant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: createdProductId,
            name: variant.name.trim(),
            unit_id: parseInt(variant.unit_id.toString()),
            sku: variant.sku.trim(),
            price: parseFloat(variant.price.toString()),
            stock: parseInt(variant.stock.toString()),
          })
        }).then(async (response) => {
           if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || `Failed to create variant ${variant.name}`);
           }
           return response.json();
        });
      });

      // 5. Execute all requests
      await Promise.all(variantRequests);

      toast.dismiss(loadingToast);
      toast.success(`Successfully added ${variants.length} variants!`, { duration: 3000, position: "top-center" });
      setCurrentStep(3);
    } catch (error) {
      console.error("Variant Error:", error);
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "Error creating variants. Please check SKUs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== STEP 3: IMAGES LOGIC =====================
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImages: ImagePreview[] = [];
    Array.from(e.target.files).forEach((file) => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        newImages.push({ file, preview: URL.createObjectURL(file) });
      }
    });
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleUploadImages = async () => {
    if (selectedImages.length === 0) return;
    const loadingToast = toast.loading(`Uploading images...`, { position: "top-center" });
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("product_id", createdProductId);
      selectedImages.forEach((img) => formData.append("images", img.file));
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/images/upload/multiple`, { method: "POST", body: formData });
      toast.dismiss(loadingToast);
      toast.success(`Product setup complete!`, { duration: 4000, position: "top-center" });
      handleCompleteAddProduct();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteAddProduct = () => {
    selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setCurrentStep(1);
    setProductData(initialProductData);
    setCreatedProductId("");
    setVariants([initialVariantData]);
    setSelectedImages([]);
    setShowAddModal(false);
    fetchProducts(currentPage);
  };

  const handleCancelAddProduct = () => {
    if (window.confirm("Cancel addition? Data will be lost.")) handleCompleteAddProduct();
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ===================== TABLE CONFIGURATION =====================
  const handleCellClick = (productId: string) => {
    router.push(`/productvariants/${productId}`);
  };

  const columns = [
    {
      key: "image",
      label: "Product",
      render: (row: Product) => (
        <div 
            onClick={() => handleCellClick(row.id)} 
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="h-11 w-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={getPrimaryImage(row.images)}
              alt={row.name}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=No+Image"; }}
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{row.name}</div>
            <div className="text-xs text-gray-500 font-mono tracking-wide">{row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row: Product) => (
        <div onClick={() => handleCellClick(row.id)} className="cursor-pointer">
             <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
              {row.category ? row.category.name : "Uncategorized"}
            </span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => (
        <div onClick={() => handleCellClick(row.id)} className="font-semibold text-gray-900 text-sm cursor-pointer">
          ${row.price.toFixed(2)}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock Status",
      render: (row: Product) => (
        <div onClick={() => handleCellClick(row.id)} className="flex flex-col cursor-pointer">
            <span className={`text-xs font-bold ${row.stock > 0 ? "text-gray-900" : "text-red-600"}`}>
                {row.stock} units
            </span>
            <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${row.inStock === "AVILABLE" ? "bg-emerald-500" : "bg-red-500 shadow-red-200 shadow-sm"}`}></div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                    {row.inStock === "AVILABLE" ? "In Stock" : "Out"}
                </span>
            </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Attributes",
      render: (row: Product) => (
        <div onClick={() => handleCellClick(row.id)} className="flex flex-wrap gap-1.5 cursor-pointer max-w-[150px]">
          {row.isVisible && <span className="px-1.5 py-0.5 rounded-md border border-blue-100 bg-blue-50 text-blue-700 text-[10px] font-bold">Visible</span>}
          {row.isFeatured && <span className="px-1.5 py-0.5 rounded-md border border-amber-100 bg-amber-50 text-amber-700 text-[10px] font-bold">Featured</span>}
          {row.isPerishable && <span className="px-1.5 py-0.5 rounded-md border border-rose-100 bg-rose-50 text-rose-700 text-[10px] font-bold">Perishable</span>}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Product) => (
        <div className="flex justify-end items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); setViewDetailsModal(row); }} // Stop propagation
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-8 text-xs font-medium"
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => handleDeleteProduct(row.id, e)} // Stop propagation
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs font-medium"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // ===================== RENDER =====================
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Inventory Management" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-gray-900">Products</h2>
           <p className="text-gray-500 text-sm mt-1.5 max-w-xl">
             Manage your product catalog. Click on any product row to view and manage its variants directly.
           </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRefresh} variant="outline" className="bg-white hover:bg-gray-50 font-medium">
            Refresh Data
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-gray-900 hover:bg-black text-white shadow-md hover:shadow-lg transition-all">
            <span className="mr-2 text-lg leading-none">+</span> Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Total Products" value={products.length} icon="📦" />
        <StatCard label="Active Categories" value={categories.length} icon="🏷️" />
        <StatCard label="Measurement Units" value={units.length} icon="📏" />
      </div>

      {/* Main Table Card */}
      <ComponentCard className="!p-0 !border-0 !shadow-none !bg-transparent">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mb-4"></div>
            <p className="text-gray-500 text-sm font-medium">Syncing inventory data...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-xl border border-red-100">
            <h3 className="text-red-800 font-semibold mb-2">Failed to load data</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={handleRefresh} size="sm" className="bg-white border border-red-200 text-red-700">Retry</Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {products.length > 0 ? (
              <div className="group/table">
                <BasicTableOne columns={columns} data={products} />
              </div>
            ) : (
              <div className="text-center py-24 flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6 max-w-xs mx-auto">Get started by adding items to your inventory.</p>
                <Button onClick={() => setShowAddModal(true)} className="bg-gray-900 text-white">Create Product</Button>
              </div>
            )}
          </div>
        )}
      </ComponentCard>

      {/* ===================== ADD PRODUCT MODAL ===================== */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={handleCancelAddProduct} className="max-w-4xl">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <p className="text-xs text-gray-500 mt-0.5">Step {currentStep} of 3</p>
              </div>
              <button onClick={handleCancelAddProduct} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5">
                <div className="bg-gray-900 h-full transition-all duration-500 ease-out" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
              
              {/* === STEP 1: DETAILS === */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                      <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</Label>
                      <Input name="name" value={productData.name} onChange={handleProductChange} placeholder="e.g. Classic White Shirt" disabled={isSubmitting} className="bg-white border-gray-200 focus:border-gray-900 transition-colors" />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</Label>
                      <textarea name="description" value={productData.description} onChange={handleProductChange} placeholder="Describe the product features..." className="w-full p-4 text-sm border border-gray-200 rounded-lg min-h-[120px] focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white resize-y" disabled={isSubmitting} />
                    </div>

                    <div>
                      <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</Label>
                      <Input name="sku" value={productData.sku} onChange={handleProductChange} placeholder="SKU-12345" disabled={isSubmitting} className="bg-white" />
                    </div>
                    <div>
                      <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Price</Label>
                      <Input type="number" name="price" value={productData.price} onChange={handleProductChange} placeholder="0.00" disabled={isSubmitting} className="bg-white" />
                    </div>
                    <div>
                      <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Stock</Label>
                      <Input type="number" name="stock" value={productData.stock} onChange={handleProductChange} placeholder="0" disabled={isSubmitting} className="bg-white" />
                    </div>
                    <div>
                       <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</Label>
                       <select name="inStock" value={productData.inStock} onChange={handleProductChange} className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none" disabled={isSubmitting}>
                        <option value="AVILABLE">In Stock</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                       <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</Label>
                       <select name="category_id" value={productData.category_id} onChange={handleProductChange} className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none" disabled={isSubmitting || isFetchingCategories}>
                        <option value="">Select Category</option>
                        {categories.map((c) => (<option key={c.id} value={c.category_id}>{c.name}</option>))}
                      </select>
                    </div>
                    <div>
                       <Label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</Label>
                       <select name="unit_id" value={productData.unit_id} onChange={handleProductChange} className="w-full h-11 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none" disabled={isSubmitting || isFetchingUnits}>
                        <option value="">Select Unit</option>
                        {units.map((u) => (<option key={u.unit_id} value={u.unit_id}>{u.name} ({u.short})</option>))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 pt-6 border-t border-gray-200/60">
                     {["isVisible", "isFeatured", "isPerishable"].map((key) => (
                         <label key={key} className="flex items-center gap-2.5 cursor-pointer group select-none">
                            <input type="checkbox" name={key} checked={(productData as any)[key]} onChange={handleProductChange} className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer" disabled={isSubmitting} />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 capitalize">{key.replace('is', '')}</span>
                         </label>
                     ))}
                  </div>
                </div>
              )}

              {/* === STEP 2: VARIANTS (OPTIMIZED) === */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Configure Variants</p>
                        <p className="text-xs text-blue-700">Add variations for <strong>{productData.name}</strong> (e.g., 500g, 1kg).</p>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={addVariant} 
                        variant="outline" 
                        disabled={isSubmitting} 
                        className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 text-xs h-9 shadow-sm"
                    > 
                        + Add Another Variant 
                    </Button>
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {variants.map((variant, index) => (
                        <div key={index} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-900 transition-all relative group">
                        
                        {/* Header Row: Variant Label + Delete Button */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                            Option #{index + 1}
                            </span>
                            {variants.length > 1 && ( 
                            <button 
                                onClick={() => removeVariant(index)} 
                                disabled={isSubmitting}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove this variant"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button> 
                            )}
                        </div>

                        {/* Input Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            
                            {/* Name */}
                            <div className="md:col-span-3">
                            <Label className="mb-1 text-[10px] uppercase text-gray-400">Variant Name</Label>
                            <Input 
                                name="name" 
                                value={variant.name} 
                                onChange={(e) => handleVariantChange(index, e)} 
                                placeholder="e.g. 1kg Packet" 
                                className="h-10 text-sm"
                                disabled={isSubmitting}
                            />
                            </div>

                            {/* SKU */}
                            <div className="md:col-span-3">
                            <Label className="mb-1 text-[10px] uppercase text-gray-400">Unique SKU</Label>
                            <Input 
                                name="sku" 
                                value={variant.sku} 
                                onChange={(e) => handleVariantChange(index, e)} 
                                placeholder="SKU-1KG" 
                                className="h-10 text-sm"
                                disabled={isSubmitting}
                            />
                            </div>

                            {/* Unit */}
                            <div className="md:col-span-2">
                            <Label className="mb-1 text-[10px] uppercase text-gray-400">Unit</Label>
                            <select 
                                name="unit_id" 
                                value={variant.unit_id} 
                                onChange={(e) => handleVariantChange(index, e)} 
                                className="w-full h-10 px-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-900 outline-none"
                                disabled={isSubmitting}
                            >
                                <option value="">Select</option>
                                {units.map((u) => (<option key={u.unit_id} value={u.unit_id}>{u.short}</option>))}
                            </select>
                            </div>

                            {/* Price */}
                            <div className="md:col-span-2">
                            <Label className="mb-1 text-[10px] uppercase text-gray-400">Price</Label>
                            <Input 
                                type="number" 
                                name="price" 
                                value={variant.price} 
                                onChange={(e) => handleVariantChange(index, e)} 
                                placeholder="0.00" 
                                className="h-10 text-sm"
                                disabled={isSubmitting}
                            />
                            </div>

                            {/* Stock */}
                            <div className="md:col-span-2">
                            <Label className="mb-1 text-[10px] uppercase text-gray-400">Stock</Label>
                            <Input 
                                type="number" 
                                name="stock" 
                                value={variant.stock} 
                                onChange={(e) => handleVariantChange(index, e)} 
                                placeholder="0" 
                                className="h-10 text-sm"
                                disabled={isSubmitting}
                            />
                            </div>

                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* === STEP 3: IMAGES === */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative group bg-white">
                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" disabled={isSubmitting} />
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                        <span className="text-2xl">☁️</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">Click to upload product images</p>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP up to 5MB</p>
                  </div>

                  {selectedImages.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Preview ({selectedImages.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedImages.map((img, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square shadow-sm">
                                <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))} className="bg-white text-red-600 rounded-full p-2 hover:bg-red-50 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white rounded-b-xl flex justify-between items-center z-10">
              <Button onClick={handleBackStep} variant="ghost" disabled={currentStep === 1 || isSubmitting} className={`text-gray-500 ${currentStep === 1 ? 'invisible' : ''}`}>Back</Button>
              <div className="flex gap-3">
                {currentStep > 1 && <Button onClick={currentStep === 2 ? () => setCurrentStep(3) : handleCompleteAddProduct} variant="ghost" className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>Skip</Button>}
                <Button onClick={handleCancelAddProduct} variant="outline" disabled={isSubmitting} className="border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</Button>
                {currentStep === 1 && <Button onClick={handleCreateProduct} className="bg-gray-900 hover:bg-black text-white min-w-[120px]" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Next: Variants"}</Button>}
                {currentStep === 2 && <Button onClick={handleCreateVariants} className="bg-gray-900 hover:bg-black text-white min-w-[120px]" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Next: Images"}</Button>}
                {currentStep === 3 && <Button onClick={handleUploadImages} className="bg-gray-900 hover:bg-black text-white min-w-[120px]" disabled={isSubmitting || selectedImages.length === 0}>{isSubmitting ? "Uploading..." : "Finish"}</Button>}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== DETAILS MODAL ===================== */}
      {viewDetailsModal && (
        <Modal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)} className="max-w-3xl">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{viewDetailsModal.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-mono text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">{viewDetailsModal.sku}</span>
                  </div>
                </div>
                <button onClick={() => setViewDetailsModal(null)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">×</button>
            </div>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                     <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gallery</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {viewDetailsModal.images?.length > 0 ? viewDetailsModal.images.map((img) => (
                                <div key={img.id} className="aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50"><img src={img.url} className="w-full h-full object-cover" /></div>
                            )) : <div className="col-span-4 py-8 bg-gray-50 text-center text-sm text-gray-400 rounded-lg">No images</div>}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{viewDetailsModal.description || "No description."}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                        <div><label className="text-xs text-gray-500 block">Price</label><div className="text-2xl font-bold text-gray-900">${viewDetailsModal.price.toFixed(2)}</div></div>
                        <div><label className="text-xs text-gray-500 block">Current Stock</label><div className="font-semibold text-gray-900">{viewDetailsModal.stock}</div></div>
                        <div><label className="text-xs text-gray-500 block">Category</label><div className="font-semibold text-gray-900">{viewDetailsModal.category?.name || "N/A"}</div></div>
                        <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                             <div className="flex flex-col"><span className="text-gray-400">Visible</span><span className="font-medium">{viewDetailsModal.isVisible ? "Yes" : "No"}</span></div>
                             <div className="flex flex-col"><span className="text-gray-400">Featured</span><span className="font-medium">{viewDetailsModal.isFeatured ? "Yes" : "No"}</span></div>
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => router.push(`/productvariants/${viewDetailsModal.id}`)}>Manage Variants</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}