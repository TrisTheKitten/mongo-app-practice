"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProductForm from "@/app/components/ProductForm";

const emptyFormValues = {
  code: "",
  name: "",
  description: "",
  price: "",
  category: ""
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return value;
  }
  return `฿${numberValue.toLocaleString()}`;
};

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState(emptyFormValues);
  const [editMode, setEditMode] = useState(false);

  const resetForm = useCallback(() => {
    setFormValues((current) => ({
      ...emptyFormValues,
      category: categories[0]?._id || current.category
    }));
  }, [categories]);

  const fetchProducts = useCallback(async () => {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    const mapped = p.map((product) => ({
      ...product,
      id: product._id,
      categoryName: product.category?.name ?? "",
    }));
    setProducts(mapped);
  }, [API_BASE]);

  const fetchCategories = useCallback(async () => {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategories(c);
    if (!editMode && c.length > 0) {
      setFormValues((current) => ({
        ...current,
        category: current.category || c[0]._id
      }));
    }
  }, [API_BASE, editMode]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleCreate = useCallback(async (data) => {
    await fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    resetForm();
    fetchProducts();
  }, [API_BASE, fetchProducts, resetForm]);

  const stopEditMode = useCallback(() => {
    setEditMode(false);
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback(async (data) => {
    await fetch(`${API_BASE}/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    stopEditMode();
    fetchProducts();
  }, [API_BASE, fetchProducts, stopEditMode]);

  const startEditMode = useCallback(async (product) => {
    const response = await fetch(`${API_BASE}/product/${product._id}`, { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setFormValues(data);
    setEditMode(true);
  }, [API_BASE]);

  const deleteProduct = useCallback(async (product) => {
    if (!confirm(`Are you sure to delete [${product.name}]`)) return;

    await fetch(`${API_BASE}/product/${product._id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }, [API_BASE, fetchProducts]);

  const columns = useMemo(() => [
    { field: "code", headerName: "Code", width: 140 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "categoryName", headerName: "Category", flex: 1, minWidth: 180 },
    {
      field: "price",
      headerName: "Price",
      width: 140,
      type: "number",
      valueFormatter: ({ value }) => formatPrice(value),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="edit" size="small" onClick={() => startEditMode(params.row)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="delete" size="small" color="error" onClick={() => deleteProduct(params.row)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ], [deleteProduct, startEditMode]);

  return (
    <main className="space-y-6 bg-slate-50 p-6">
      <div className="max-w-6xl space-y-6">
        <div className="space-y-2">
          <Typography variant="h4" component="h1" className="font-semibold text-gray-900">
            Products
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Create detailed product entries and manage them in a unified grid.
          </Typography>
        </div>

        <ProductForm
          initialValues={formValues}
          categories={categories}
          onSubmit={editMode ? handleEdit : handleCreate}
          submitLabel={editMode ? "Update" : "Add"}
          onCancel={editMode ? stopEditMode : undefined}
          isEditing={editMode}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <DataGrid
            rows={products}
            columns={columns}
            disableRowSelectionOnClick
            autoHeight
            density="comfortable"
            sx={{
              border: "none",
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              },
              '& .MuiDataGrid-row': {
                borderBottom: '1px solid #f1f5f9',
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
