"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { deleteProduct } from "@/lib/api/admin-products";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/currency";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError("");

      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
              HONEYSTORE Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
              Products
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Create, update, and manage store products.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex h-12 items-center justify-center gap-2 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            <Plus size={17} />
            Add Product
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <LoaderCircle
              className="animate-spin"
              size={28}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="border border-black/10 bg-white px-6 py-20 text-center">
            <h2 className="text-2xl font-bold">
              No products
            </h2>

            <p className="mt-3 text-sm text-black/45">
              Add the first HONEYSTORE product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-black/10 bg-white">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-black/10 bg-[#f7f7f7]">
                <tr className="text-xs uppercase tracking-[0.08em] text-black/45">
                  <th className="px-5 py-4 font-semibold">
                    Product
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Category
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Price
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Stock
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-black/10 last:border-b-0"
                  >
                    <td className="px-5 py-5">
                      <p className="text-xs uppercase tracking-[0.08em] text-black/40">
                        {product.brand}
                      </p>

                      <p className="mt-1 font-semibold">
                        {product.name}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-sm capitalize">
                      {product.category}
                    </td>

                    <td className="px-5 py-5 text-sm font-medium">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {product.stock}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                          className="flex h-10 w-10 items-center justify-center border border-black/20 transition hover:border-black"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          disabled={
                            deletingId === product.id
                          }
                          onClick={() =>
                            handleDelete(product)
                          }
                          className="flex h-10 w-10 items-center justify-center border border-black/20 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === product.id ? (
                            <LoaderCircle
                              className="animate-spin"
                              size={16}
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}