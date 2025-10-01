# Product App
Next.js 14
This app shows
1. MongoDB CRUD operations using Mongoose
2. Client Components interacting with APIs
3. Server Components Interacting with Server Actions

# Setup
1. Define in .env the followings
1.1 MONGODB_URI
1.2 NEXT_PUBLIC_API_URL

# Category Management
1. Use `GET /api/category/[id]` to retrieve a single category for editing.
2. The edit form reuses the create form and resets its state with the fetched category data.
3. When updating schema fields, drop the existing collection and restart the Next.js server to refresh the cached Mongoose model.

# Product Management
1. Use `GET /api/product/[id]` to retrieve a single product with its populated category reference for editing.
2. The product form shares add/edit logic and resets using `reset()` from React Hook Form.
3. Product listings load through the same API and render in the MUI `DataGrid` for consistent UI behavior.
4. If the product schema changes, drop the collection and restart the Next.js server to reload the cached model.
