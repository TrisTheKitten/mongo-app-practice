"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = { name: "", order: "" };

export default function CategoryForm({ initialValues = defaultFormValues, onSubmit, submitLabel, onCancel, isEditing }) {
  const normalizedValues = useMemo(() => {
    const value = initialValues?.order;
    return {
      ...defaultFormValues,
      ...initialValues,
      order: value === undefined || value === null || value === "" ? "" : String(value)
    };
  }, [initialValues]);

  const { register, handleSubmit, reset } = useForm({ defaultValues: normalizedValues });

  useEffect(() => {
    reset(normalizedValues);
  }, [normalizedValues, reset]);

  function submitHandler(data) {
    const payload = {
      ...initialValues,
      ...data,
      order: data.order === "" ? null : Number(data.order)
    };
    onSubmit(payload);
  }

  const title = isEditing ? "Edit Category" : "Create Category";
  const subtitle = isEditing ? "Update the category details and ordering." : "Add a new category to organize your products.";

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-1 border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="category-name">Category name</label>
        <div>
          <input
            id="category-name"
            type="text"
            {...register("name", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label className="text-sm font-medium text-gray-700" htmlFor="category-order">Order</label>
        <div>
          <input
            id="category-order"
            type="number"
            {...register("order", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
