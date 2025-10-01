"use client";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CategoryForm from "@/app/components/CategoryForm";

export default function Home() {

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'order', headerName: 'Order', width: 120, type: "number" },
    {
      field: 'action', headerName: 'Action', width: 140, sortable: false, filterable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="edit" size="small" onClick={() => startEditMode(params.row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="delete" size="small" color="error" onClick={() => deleteCategory(params.row)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [categoryList, setCategoryList] = useState([]);
  const [formValues, setFormValues] = useState({ name: "", order: "" });
  const [editMode, setEditMode] = useState(false);

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  async function handleCreate(data) {
    await fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setFormValues({ name: "", order: "" });
    fetchCategory();
  }

  async function handleEdit(data) {
    await fetch(`${API_BASE}/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    stopEditMode();
    fetchCategory();
  }

  async function startEditMode(category) {
    const response = await fetch(`${API_BASE}/category/${category._id}`, { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setFormValues(data);
    setEditMode(true);
  }

  function stopEditMode() {
    setFormValues({ name: "", order: "" });
    setEditMode(false);
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;

    const id = category._id
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    })
    fetchCategory()
  }

  return (
    <main className="space-y-6 bg-slate-50 p-6">
      <div className="max-w-5xl space-y-6">
        <div className="space-y-2">
          <Typography variant="h4" component="h1" className="font-semibold text-gray-900">
            Categories
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Manage category ordering and keep your catalog organized.
          </Typography>
        </div>

        <CategoryForm
          initialValues={formValues}
          onSubmit={editMode ? handleEdit : handleCreate}
          submitLabel={editMode ? "Update" : "Add"}
          onCancel={editMode ? stopEditMode : undefined}
          isEditing={editMode}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <DataGrid
            rows={categoryList}
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
