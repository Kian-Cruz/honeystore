"use client";

import Link from "next/link";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

import {
  type ProductInput,
  updateProduct,
} from "@/lib/api/admin-products";
import { getProducts } from "@/lib/api/products";

const inputClass =
  "h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] =
    useState<ProductInput | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setError("");

        const products = await getProducts();
        const selectedProduct = products.find(
          (item) => item.id === params.id
        );

        if (!selectedProduct) {
          setError("Product not found");
          return;
        }

        setProduct({
          name: selectedProduct.name,
          slug: selectedProduct.slug,
          description: selectedProduct.description,
          price: selectedProduct.price,
          compareAtPrice:
            selectedProduct.compareAtPrice,
          category: selectedProduct.category,
          subcategory:
            selectedProduct.subcategory,
          brand: selectedProduct.brand,
          image: selectedProduct.image,
          images: selectedProduct.images,
          stock: selectedProduct.stock,
          featured: selectedProduct.featured,
          newArrival:
            selectedProduct.newArrival,
          active: true,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [params.id]);

  function updateField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K]
  ) {
    setProduct((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  function normalizeImagePath(path: string) {
    const normalized = path
      .trim()
      .replaceAll("\\", "/");

    if (
      normalized.startsWith("/") ||
      normalized.startsWith("http://") ||
      normalized.startsWith("https://")
    ) {
      return normalized;
    }

    return `/${normalized}`;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!product) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const image = normalizeImagePath(
        product.image
      );

      await updateProduct(params.id, {
        ...product,
        image,
        images: [image],
        compareAtPrice:
          product.compareAtPrice || undefined,
      });

      router.push("/admin/products");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[600px] items-center justify-center">
        <LoaderCircle
          className="animate-spin"
          size={30}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">
          Product not found
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <Link
          href="/admin/products"
          className="mt-7 inline-flex h-12 items-center bg-black px-6 text-sm font-semibold text-white"
        >
          Return to Products
        </Link>
      </main>
    );
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
            Edit Product
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Update {product.name}
          </p>
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
            <Field label="Product Name" id="name">
              <input
                id="name"
                required
                value={product.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Slug" id="slug">
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
              id="description"
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

          {/* Organization */}
          <FormSection title="Organization">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Brand" id="brand">
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

              <Field label="Category" id="category">
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
              id="subcategory"
            >
              <input
                id="subcategory"
                value={product.subcategory ?? ""}
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

          {/* Price and inventory */}
          <FormSection title="Price and Inventory">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Selling Price (MMK)"
                id="price"
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
                id="compareAtPrice"
              >
                <input
                  id="compareAtPrice"
                  type="number"
                  min="0"
                  value={
                    product.compareAtPrice ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "compareAtPrice",
                      event.target.value
                        ? Number(event.target.value)
                        : undefined
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Stock" id="stock">
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
            <Field label="Image Path" id="image">
              <input
                id="image"
                required
                value={product.image}
                onChange={(event) =>
                  updateField(
                    "image",
                    event.target.value
                  )
                }
                className={inputClass}
              />

              <p className="mt-2 text-xs text-black/45">
                Example:
                /products/uniqlo-jacket.jpg
              </p>
            </Field>
          </FormSection>

          {/* Settings */}
          <FormSection title="Product Settings">
            <div className="space-y-4">
              <Checkbox
                label="New arrival"
                checked={
                  product.newArrival ?? false
                }
                onChange={(checked) =>
                  updateField(
                    "newArrival",
                    checked
                  )
                }
              />

              <Checkbox
                label="Featured product"
                checked={
                  product.featured ?? false
                }
                onChange={(checked) =>
                  updateField("featured", checked)
                }
              />

              <Checkbox
                label="Active and visible"
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
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 bg-black px-7 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && (
              <LoaderCircle
                className="animate-spin"
                size={17}
              />
            )}

            Save Changes
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
  id: string;
  children: React.ReactNode;
};

function Field({
  label,
  id,
  children,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
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