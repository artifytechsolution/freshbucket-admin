"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { useOrderByList } from "@/hooks/apiHooks";
import { PencilIcon } from "@/icons";
import { selectUser } from "@/redux/reducers/authSlice";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

const formatDateTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

// Filter interface
interface FilterState {
  orderId: string;
  orderType: string;
  orderStatus: string;
  hotelName: string;
  customerName: string;
  amountMin: string;
  amountMax: string;
  totalDaysMin: string;
  totalDaysMax: string;
  checkInFrom: string;
  checkInTo: string;
}

const initialFilterState: FilterState = {
  orderId: "",
  orderType: "",
  orderStatus: "",
  hotelName: "",
  customerName: "",
  amountMin: "",
  amountMax: "",
  totalDaysMin: "",
  totalDaysMax: "",
  checkInFrom: "",
  checkInTo: "",
};

export default function BasicTables() {
  const router = useRouter();
  const [orderList, setOrderList] = useState([]);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const user = useAppSelector(selectUser)

  console.log("helllloooooooo user is here----------------------->")
  console.log(user)

  const {
    isError,
    isLoading,
    data: orderData,
    error,
    mutate: hotelMutation,
  } = useOrderByList();

  useEffect(() => {
    hotelMutation({
      hotel_id:user.hotel_id
    });
  }, [hotelMutation]);

  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      router.push("/login ");
    }
    if (Array.isArray(orderData?.data)) {
      setOrderList(orderData.data);
    }
  }, [isError, isLoading, error, orderData, router]);

  // Filter logic
  const filteredOrderList = useMemo(() => {
    if (!orderList.length) return [];

    return orderList.filter((row: any) => {
      const order = row.orders?.[0];
      if (!order) return false;

      // Order ID filter
      if (filters.orderId && !order.id?.toString().toLowerCase().includes(filters.orderId.toLowerCase())) {
        return false;
      }

      // Order Type filter
      if (filters.orderType && order.order_type !== filters.orderType) {
        return false;
      }

      // Order Status filter
      if (filters.orderStatus) {
        const status = order.status === "PENDING" ? "PENDING" : 
                      row.status === "SUCCESS" ? "SUCCESS" : "FAIL";
        if (status !== filters.orderStatus) return false;
      }

      // Hotel Name filter
      if (filters.hotelName && 
          !order.reservation?.hotel?.name?.toLowerCase().includes(filters.hotelName.toLowerCase())) {
        return false;
      }

      // Customer Name filter
      if (filters.customerName) {
        const fullName = `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.toLowerCase();
        if (!fullName.includes(filters.customerName.toLowerCase())) {
          return false;
        }
      }

      // Amount range filter
      if (filters.amountMin && order.amount < parseFloat(filters.amountMin)) {
        return false;
      }
      if (filters.amountMax && order.amount > parseFloat(filters.amountMax)) {
        return false;
      }

      // Total days range filter
      if (filters.totalDaysMin && order.reservation?.total_days < parseInt(filters.totalDaysMin)) {
        return false;
      }
      if (filters.totalDaysMax && order.reservation?.total_days > parseInt(filters.totalDaysMax)) {
        return false;
      }

      // Check-in date range filter
      if (filters.checkInFrom || filters.checkInTo) {
        const checkInDate = new Date(order.reservation?.check_in_datetime);
        if (filters.checkInFrom && checkInDate < new Date(filters.checkInFrom)) {
          return false;
        }
        if (filters.checkInTo && checkInDate > new Date(filters.checkInTo)) {
          return false;
        }
      }

      return true;
    });
  }, [orderList, filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  // Get unique values for dropdown filters
  const getUniqueOrderTypes = () => {
    const types = orderList
      .map((row: any) => row.orders?.[0]?.order_type)
      .filter(Boolean);
    return [...new Set(types)];
  };

  const getUniqueOrderStatuses = () => {
    return ["PENDING", "SUCCESS", "FAIL"];
  };

  console.log("order data is here:", orderList);
  console.log("filtered data:", filteredOrderList);

  const columns = [
    { 
      key: "orders.id", 
      label: "OrderId",
      render: (row: any) => row.orders[0]?.id ?? "-"
    },
    { 
      key: "orders.order_type", 
      label: "Order Type",
      render: (row: any) => row.orders[0]?.order_type ?? "-" 
    },
    {
      key: "status",
      label: "Order Status",
      render: (row: any) => {
        const status = row.orders[0]?.status === "PENDING" ? "PENDING" : 
                      row.status === "SUCCESS" ? "SUCCESS" : "FAIL";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
            status === "SUCCESS" ? "bg-green-100 text-green-800" :
            "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        );
      }
    },
    {
      key: "order.reservation.hotel.name",
      label: "Hotel Name",
      render: (row: any) => row?.orders[0]?.reservation?.hotel?.name ?? "-"
    },
    { 
      key: "amount", 
      label: "Amount", 
      render: (row: any) => row?.orders[0]?.amount ? `₹${row?.orders?.amount?.toLocaleString()}` : "-" 
    },
    {
      key: "order.reservation.total_days",
      label: "Total Days",
      render: (row: any) => row?.orders[0]?.reservation?.total_days ?? "-"
    },
    {
      key: "reservation.check_in_datetime",
      label: "Check-in",
      render: (row: any) => formatDateTime(row?.orders[0]?.reservation?.check_in_datetime)
    },
    {
      key: "reservation.check_out_datetime",
      label: "Check-out",
      render: (row: any) => formatDateTime(row.orders[0]?.reservation?.check_out_datetime)
    },
    {
      key: "reservation.firstName",
      label: "Customer Name",
      render: (row: any) => {
        const firstName = row.orders[0]?.user?.firstName || "";
        const lastName = row.orders?.user?.lastName || "";
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";
      }
    }
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Order Table" />
      <div className="space-y-6">
        <ComponentCard title="Order Management - Hotel Perspective">
          {/* Filter Section */}
          <div className="mb-6 space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-md transition-colors"
                >
                  {showAdvancedFilters ? "Basic Filters" : "Advanced Filters"}
                </button>
              </div>
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Order ID Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  value={filters.orderId}
                  onChange={(e) => handleFilterChange("orderId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Order Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Type
                </label>
                <select
                  value={filters.orderType}
                  onChange={(e) => handleFilterChange("orderType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">All Types</option>
                  {getUniqueOrderTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Order Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.orderStatus}
                  onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">All Status</option>
                  {getUniqueOrderStatuses().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Hotel Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  placeholder="Search by Hotel Name..."
                  value={filters.hotelName}
                  onChange={(e) => handleFilterChange("hotelName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Customer Name Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Search by Customer Name..."
                      value={filters.customerName}
                      onChange={(e) => handleFilterChange("customerName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  {/* Amount Range */}
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Min amount..."
                        value={filters.amountMin}
                        onChange={(e) => handleFilterChange("amountMin", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Max amount..."
                        value={filters.amountMax}
                        onChange={(e) => handleFilterChange("amountMax", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Days Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Min Days
                    </label>
                    <input
                      type="number"
                      placeholder="Min days..."
                      value={filters.totalDaysMin}
                      onChange={(e) => handleFilterChange("totalDaysMin", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Days
                    </label>
                    <input
                      type="number"
                      placeholder="Max days..."
                      value={filters.totalDaysMax}
                      onChange={(e) => handleFilterChange("totalDaysMax", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  {/* Check-in Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-in From
                    </label>
                    <input
                      type="date"
                      value={filters.checkInFrom}
                      onChange={(e) => handleFilterChange("checkInFrom", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-in To
                    </label>
                    <input
                      type="date"
                      value={filters.checkInTo}
                      onChange={(e) => handleFilterChange("checkInTo", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Showing {filteredOrderList.length} of {orderList.length} orders</span>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>{Object.values(filters).filter(v => v).length} filter(s) applied</span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading orders...</span>
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <BasicTableOne 
              columns={columns} 
              data={filteredOrderList} 
              emptyMessage={
                hasActiveFilters 
                  ? "No orders found matching your filters. Try adjusting the filter criteria."
                  : "No orders found."
              }
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
