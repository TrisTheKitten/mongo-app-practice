"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  code: "",
  name: "",
  description: "",
  price: "",
  category: ""
};

export default function ProductForm({ initialValues = defaultFormValues, categories = [], onSubmit, submitLabel, onCancel, isEditing }) {
  const normalizedValues = useMemo(() => {
    const priceValue = initialValues?.price;
    const categoryValue = initialValues?.category;
    return {
      ...defaultFormValues,
      ...initialValues,
      price: priceValue === undefined || priceValue === null || priceValue === "" ? "" : String(priceValue),
      category: typeof categoryValue === "object" && categoryValue !== null ? categoryValue._id ?? "" : categoryValue ?? ""
    };
  }, [initialValues]);

  const { register, handleSubmit, reset } = useForm({ defaultValues: normalizedValues });

  useEffect(() => {
    reset(normalizedValues);
  }, [normalizedValues, reset]);

  function submitHandler(data) {
    const payload = {
      ...initialValues,
      price: data.price === "" ? null : Number(data.price)
    };
    onSubmit(payload);
  }

  const title = isEditing ? "Edit Product" : "Create Product";
  const subtitle = isEditing ? "Update product information and pricing." : "Add a new product with full details.";

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
        <label className="text-sm font-medium text-gray-700" htmlFor="product-code">Code</label>
        <div>
          <input
            id="product-code"
            type="text"
            {...register("code", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label className="text-sm font-medium text-gray-700" htmlFor="product-name">Name</label>
        <div>
          <input
            id="product-name"
            type="text"
            {...register("name", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label className="text-sm font-medium text-gray-700" htmlFor="product-description">Description</label>
        <div>
          <textarea
            id="product-description"
            {...register("description", { required: true })}
            className="h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label className="text-sm font-medium text-gray-700" htmlFor="product-price">Price</label>
        <div>
          <input
            id="product-price"
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label className="text-sm font-medium text-gray-700" htmlFor="product-category">Category</label>
        <div>
          <select
            id="product-category"
            {...register("category", { required: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={categories.length === 0}
          >
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
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
