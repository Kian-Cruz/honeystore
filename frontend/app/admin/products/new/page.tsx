"use client";

import Link from "next/link";
import {
  type FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

import {
  createProduct,
  type ProductInput,
} from "@/lib/api/admin-products";

const inputClass =
  "h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black";

const initialProduct: ProductInput = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  category: "beauty",
  subcategory: "",
  brand: "",
  image: "",
  images: [],
  stock: 0,
  featured: false,
  newArrival: true,
  active: true,
};

export default function NewProductPage() {
  const router = useRouter();

  const [product, setProduct] =
    useState<ProductInput>(initialProduct);

  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  function createSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function updateField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K]
  ) {
    setProduct((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(name: string) {
    setProduct((current) => ({
      ...current,
      name,
      slug: createSlug(name),
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload: ProductInput = {
        ...product,
        compareAtPrice: compareAtPrice
          ? Number(compareAtPrice)
          : undefined,
        images: product.image
          ? [product.image]
          : [],
      };

      await createProduct(payload);

      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create product"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Products
          </Link>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
            HONEYSTORE Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
            Add Product
          </h1>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl px-4 py-10 sm:px-6"
      >
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic information */}
          <FormSection title="Basic Information">
            <Field
              label="Product Name"
              htmlFor="name"
            >
              <input
                id="name"
                required
                value={product.name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Slug" htmlFor="slug">
              <input
                id="slug"
                required
                value={product.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field
              label="Description"
              htmlFor="description"
            >
              <textarea
                id="description"
                required
                rows={5}
                value={product.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                className="w-full border border-black/20 bg-white p-4 text-sm outline-none transition focus:border-black"
              />
            </Field>
          </FormSection>

          {/* Product organization */}
          <FormSection title="Organization">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Brand" htmlFor="brand">
                <input
                  id="brand"
                  required
                  value={product.brand}
                  onChange={(event) =>
                    updateField(
                      "brand",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field
                label="Category"
                htmlFor="category"
              >
                <select
                  id="category"
                  value={product.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target
                        .value as ProductInput["category"]
                    )
                  }
                  className={inputClass}
                >
                  <option value="fashion">
                    Fashion
                  </option>
                  <option value="footwear">
                    Footwear
                  </option>
                  <option value="beauty">
                    Beauty
                  </option>
                </select>
              </Field>
            </div>

            <Field
              label="Subcategory"
              htmlFor="subcategory"
            >
              <input
                id="subcategory"
                value={product.subcategory ?? ""}
                placeholder="Example: skincare or crocs"
                onChange={(event) =>
                  updateField(
                    "subcategory",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </FormSection>

          {/* Price and stock */}
          <FormSection title="Price and Inventory">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Selling Price (MMK)"
                htmlFor="price"
              >
                <input
                  id="price"
                  type="number"
                  min="0"
                  required
                  value={product.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      Number(event.target.value)
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field
                label="Original Price (MMK)"
                htmlFor="compareAtPrice"
              >
                <input
                  id="compareAtPrice"
                  type="number"
                  min="0"
                  value={compareAtPrice}
                  onChange={(event) =>
                    setCompareAtPrice(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Stock" htmlFor="stock">
                <input
                  id="stock"
                  type="number"
                  min="0"
                  required
                  value={product.stock}
                  onChange={(event) =>
                    updateField(
                      "stock",
                      Number(event.target.value)
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* Image */}
          <FormSection title="Product Image">
            <Field
              label="Image Path"
              htmlFor="image"
            >
              <input
                id="image"
                required
                value={product.image}
                placeholder="/products/anessa.jpg"
                onChange={(event) =>
                  updateField(
                    "image",
                    event.target.value
                  )
                }
                className={inputClass}
              />

              <p className="mt-2 text-xs text-black/45">
                Copy the image into
                frontend/public/products, then enter its
                path here.
              </p>
            </Field>
          </FormSection>

          {/* Settings */}
          <FormSection title="Product Settings">
            <div className="space-y-4">
              <Checkbox
                label="New arrival"
                checked={product.newArrival ?? false}
                onChange={(checked) =>
                  updateField("newArrival", checked)
                }
              />

              <Checkbox
                label="Featured product"
                checked={product.featured ?? false}
                onChange={(checked) =>
                  updateField("featured", checked)
                }
              />

              <Checkbox
                label="Active and visible in store"
                checked={product.active ?? false}
                onChange={(checked) =>
                  updateField("active", checked)
                }
              />
            </div>
          </FormSection>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="flex h-12 items-center justify-center border border-black/20 px-6 text-sm font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 items-center justify-center gap-2 bg-black px-7 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && (
              <LoaderCircle
                className="animate-spin"
                size={17}
              />
            )}

            Create Product
          </button>
        </div>
      </form>
    </main>
  );
}

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

function FormSection({
  title,
  children,
}: FormSectionProps) {
  return (
    <section className="border border-black/10 bg-white p-6 sm:p-7">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <div className="mt-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Field({
  label,
  htmlFor,
  children,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Checkbox({
  label,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-black"
      />

      {label}
    </label>
  );
}