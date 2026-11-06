import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  PackagePlus,
  Upload,
  FileCode,
  CheckCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import type { Product } from "../../../drizzle/schema";

type FormData = {
  name: string;
  price: string;
  categoryId: string;
  description: string;
  stock: string;
  imageUrl: string;
  fileUrl: string;
  fileSize: string;
  demoUrl: string;
};

const emptyForm: FormData = {
  name: "",
  price: "",
  categoryId: "",
  description: "",
  stock: "0",
  imageUrl: "",
  fileUrl: "",
  fileSize: "",
  demoUrl: "",
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();

  const {
    data: productsData = [] as Product[],
    isLoading,
    refetch,
  } = trpc.products.list.useQuery({ limit: 100, offset: 0 });
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const { data: allOrders = [], isLoading: ordersLoading } =
    trpc.admin.getAllOrders.useQuery(
      { limit: 50, offset: 0 },
      { enabled: user?.role === "admin" }
    );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [activeTab, setActiveTab] = useState<
    "products" | "orders" | "categories"
  >("products");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  const createMutation = trpc.admin.createProduct.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success("Product created successfully!");
      setShowForm(false);
      setFormData(emptyForm);
    },
    onError: err => toast.error(err.message || "Failed to create product"),
  });

  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success("Product updated successfully!");
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: err => toast.error(err.message || "Failed to update product"),
  });

  const deleteMutation = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success("Product deleted");
    },
    onError: err => toast.error(err.message || "Failed to delete product"),
  });

  const updateOrderStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      utils.admin.getAllOrders.invalidate();
      toast.success("Order status updated");
    },
    onError: err => toast.error(err.message || "Failed to update order"),
  });

  const createCategoryMutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
      toast.success("Category created!");
      setShowCategoryForm(false);
      setCategoryFormData({ name: "", description: "" });
    },
    onError: err => toast.error(err.message || "Failed to create category"),
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const uploadFileMutation = trpc.admin.uploadFile.useMutation();

  const handleFileUpload = async (
    file: File,
    type: "image" | "asset"
  ) => {
    const reader = new FileReader();
    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingAsset(true);

    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await uploadFileMutation.mutateAsync({
          fileName: file.name,
          fileBase64: base64,
          mimeType: file.type,
        });

        if (type === "image") {
          setFormData(prev => ({ ...prev, imageUrl: res.url }));
          toast.success("Image uploaded successfully!");
        } else {
          const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          setFormData(prev => ({
            ...prev,
            fileUrl: res.url,
            fileSize: sizeStr,
          }));
          toast.success(`Asset file uploaded (${sizeStr})!`);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to upload file");
      } finally {
        if (type === "image") setIsUploadingImage(false);
        else setIsUploadingAsset(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingAsset(false);
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: formData.name,
        price: formData.price,
        categoryId: parseInt(formData.categoryId),
        description: formData.description || undefined,
        stock: parseInt(formData.stock) || 0,
        imageUrl: formData.imageUrl || undefined,
        fileUrl: formData.fileUrl || undefined,
        fileSize: formData.fileSize || undefined,
        demoUrl: formData.demoUrl || undefined,
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        price: formData.price,
        categoryId: parseInt(formData.categoryId),
        description: formData.description || undefined,
        stock: parseInt(formData.stock) || 0,
        imageUrl: formData.imageUrl || undefined,
        fileUrl: formData.fileUrl || undefined,
        fileSize: formData.fileSize || undefined,
        demoUrl: formData.demoUrl || undefined,
      });
    }
  };

  const handleEdit = (product: (typeof productsData)[0]) => {
    setFormData({
      name: product.name,
      price: product.price,
      categoryId: String(product.categoryId),
      description: product.description ?? "",
      stock: String(product.stock),
      imageUrl: product.imageUrl ?? "",
      fileUrl: (product as any).fileUrl ?? "",
      fileSize: (product as any).fileSize ?? "",
      demoUrl: (product as any).demoUrl ?? "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const totalRevenue = allOrders.reduce(
    (sum, o) => sum + parseFloat(o.total),
    0
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center", color: "#00f5ff" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center" }}
        >
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #ff006e",
              borderRadius: "0.35rem",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                color: "#ff006e",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Access Denied
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              Admin privileges required.
            </p>
            <Button onClick={() => navigate("/")} className="btn-neon">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#0a0e27",
    border: "1px solid #2a2f4a",
    borderRadius: "0.35rem",
    padding: "0.75rem",
    color: "#00f5ff",
  };
  const labelStyle = {
    display: "block" as const,
    color: "#00f5ff",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
  };

  const statusOptions = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ] as const;
  const statusColor = (s: string) => {
    switch (s) {
      case "delivered":
        return "#39ff14";
      case "confirmed":
      case "shipped":
        return "#00f5ff";
      case "pending":
        return "#ff9900";
      case "cancelled":
        return "#ff006e";
      default:
        return "#00f5ff";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#ff006e",
                marginBottom: "0.5rem",
              }}
              className="neon-glow-pink"
            >
              ADMIN DASHBOARD
            </h1>
            <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>
              Logged in as {user.name || user.email}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              onClick={() => {
                refetch();
                utils.admin.getAllOrders.invalidate();
                utils.categories.list.invalidate();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "transparent",
                color: "#00f5ff",
                border: "1px solid #00f5ff",
                borderRadius: "0.35rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
            {activeTab === "categories" ? (
              <Button
                onClick={() => {
                  setShowCategoryForm(true);
                  setCategoryFormData({ name: "", description: "" });
                }}
                className="btn-neon"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Plus size={18} />
                Add Category
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="btn-neon"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Plus size={18} />
                Add Product
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          className="admin-stats-grid"
          style={{
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              label: "TOTAL PRODUCTS",
              value: isLoading ? "…" : productsData.length,
              color: "#00f5ff",
            },
            { label: "CATEGORIES", value: categories.length, color: "#b537f2" },
            {
              label: "TOTAL ORDERS",
              value: ordersLoading ? "…" : allOrders.length,
              color: "#39ff14",
            },
            {
              label: "TOTAL REVENUE",
              value: `$${totalRevenue.toFixed(2)}`,
              color: "#ff006e",
              glow: true,
            },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                padding: "1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(0, 245, 255, 0.5)",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  color: stat.color,
                  fontSize: "1.75rem",
                }}
                className={stat.glow ? "neon-glow-pink" : ""}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "1rem",
            }}
          >
            <div
              style={{
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
                padding: "2rem",
                maxWidth: "520px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
              }}
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  backgroundColor: "transparent",
                  color: "#00f5ff",
                  border: "1px solid #00f5ff",
                  borderRadius: "0.35rem",
                  padding: "0.4rem",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <PackagePlus size={22} color="#ff006e" />
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#00f5ff",
                  }}
                >
                  {editingId ? "Edit Product" : "New Product"}
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>PRODUCT NAME *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Premium UI Kit"
                    required
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>PRICE ($) *</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="49.99"
                      step="0.01"
                      min="0"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>STOCK</label>
                    <Input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="100"
                      min="0"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>CATEGORY *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select category…</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>DESCRIPTION</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description…"
                    rows={3}
                    style={{
                      ...inputStyle,
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                      PRODUCT IMAGE
                    </label>
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "image");
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      style={{
                        padding: "0.25rem 0.6rem",
                        height: "auto",
                        fontSize: "0.75rem",
                        backgroundColor: "transparent",
                        border: "1px solid #00f5ff",
                        color: "#00f5ff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Upload size={12} />
                      {isUploadingImage ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                  <Input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg or /uploads/..."
                    style={inputStyle}
                  />
                  {formData.imageUrl && (
                    <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid #2a2f4a" }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "#39ff14" }}>Image linked</span>
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                      DIGITAL ASSET FILE (.ZIP / ARCHIVE)
                    </label>
                    <input
                      type="file"
                      ref={assetInputRef}
                      style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "asset");
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => assetInputRef.current?.click()}
                      disabled={isUploadingAsset}
                      style={{
                        padding: "0.25rem 0.6rem",
                        height: "auto",
                        fontSize: "0.75rem",
                        backgroundColor: "transparent",
                        border: "1px solid #39ff14",
                        color: "#39ff14",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Upload size={12} />
                      {isUploadingAsset ? "Uploading..." : "Upload Asset File"}
                    </Button>
                  </div>
                  <Input
                    type="text"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    placeholder="URL to zip file, or click Upload Asset File"
                    style={inputStyle}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.75rem" }}>FILE SIZE</label>
                      <Input
                        type="text"
                        name="fileSize"
                        value={formData.fileSize}
                        onChange={handleInputChange}
                        placeholder="e.g. 45.2 MB"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.75rem" }}>LIVE DEMO URL</label>
                      <Input
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleInputChange}
                        placeholder="https://preview.domain.com"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}
                >
                  <Button
                    type="submit"
                    className="btn-neon"
                    style={{ flex: 1 }}
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving…"
                      : editingId
                        ? "Update Product"
                        : "Create Product"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData(emptyForm);
                    }}
                    className="btn-neon-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "1rem",
            }}
          >
            <div
              style={{
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
                padding: "2rem",
                maxWidth: "400px",
                width: "100%",
                position: "relative",
              }}
            >
              <button
                onClick={() => {
                  setShowCategoryForm(false);
                  setCategoryFormData({ name: "", description: "" });
                }}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  backgroundColor: "transparent",
                  color: "#00f5ff",
                  border: "1px solid #00f5ff",
                  borderRadius: "0.35rem",
                  padding: "0.4rem",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#00f5ff",
                  marginBottom: "1.5rem",
                }}
              >
                New Category
              </h2>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!categoryFormData.name) {
                    toast.error("Category name is required");
                    return;
                  }
                  createCategoryMutation.mutate(categoryFormData);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>NAME *</label>
                  <Input
                    type="text"
                    value={categoryFormData.name}
                    onChange={e =>
                      setCategoryFormData(p => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. UI Kits"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>DESCRIPTION</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={e =>
                      setCategoryFormData(p => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Category description…"
                    rows={3}
                    style={{
                      ...inputStyle,
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}
                >
                  <Button
                    type="submit"
                    className="btn-neon"
                    style={{ flex: 1 }}
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending
                      ? "Creating…"
                      : "Create Category"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setCategoryFormData({ name: "", description: "" });
                    }}
                    className="btn-neon-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #2a2f4a",
            paddingBottom: "1rem",
          }}
        >
          {(["products", "orders", "categories"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.6rem 1.25rem",
                backgroundColor:
                  activeTab === tab ? "rgba(255, 0, 110, 0.2)" : "transparent",
                color: activeTab === tab ? "#ff006e" : "#00f5ff",
                border: `1px solid ${activeTab === tab ? "#ff006e" : "transparent"}`,
                borderRadius: "0.35rem",
                cursor: "pointer",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              {tab}{" "}
              {tab === "products"
                ? `(${productsData.length})`
                : tab === "orders"
                  ? `(${allOrders.length})`
                  : `(${categories.length})`}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div style={{ overflowX: "auto" }}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    style={{
                      height: "56px",
                      backgroundColor: "#1a1f3a",
                      borderRadius: "0.35rem",
                      border: "1px solid #2a2f4a",
                    }}
                  />
                ))}
              </div>
            ) : productsData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(0, 245, 255, 0.5)",
                }}
              >
                <PackagePlus
                  size={48}
                  style={{ margin: "0 auto 1rem", opacity: 0.3 }}
                />
                <p>No products yet. Add your first product!</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #2a2f4a" }}>
                    {[
                      "ID",
                      "PRODUCT",
                      "PRICE",
                      "STOCK",
                      "RATING",
                      "REVIEWS",
                      "ACTIONS",
                    ].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          color: "#00f5ff",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsData.map((product: Product) => (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: "1px solid #2a2f4a",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(0,245,255,0.03)")
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "rgba(0,245,255,0.35)",
                          fontSize: "0.75rem",
                        }}
                      >
                        #{product.id}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: 700, color: "#00f5ff" }}>
                          {product.name}
                        </div>
                        {product.description && (
                          <div
                            style={{
                              fontSize: "0.73rem",
                              color: "rgba(0,245,255,0.35)",
                              marginTop: "0.15rem",
                            }}
                          >
                            {product.description.slice(0, 55)}
                            {product.description.length > 55 ? "…" : ""}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "#ff006e",
                          fontWeight: 700,
                        }}
                        className="neon-glow-pink"
                      >
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.55rem",
                            backgroundColor:
                              product.stock > 0
                                ? "rgba(57,255,20,0.12)"
                                : "rgba(255,0,110,0.12)",
                            color: product.stock > 0 ? "#39ff14" : "#ff006e",
                            borderRadius: "0.25rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          {product.stock > 0 ? product.stock : "Out"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "#00f5ff",
                          fontSize: "0.875rem",
                        }}
                      >
                        ★ {parseFloat(product.rating ?? "0").toFixed(1)}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "rgba(0,245,255,0.6)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {product.reviewCount}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={{
                              padding: "0.35rem 0.6rem",
                              backgroundColor: "transparent",
                              color: "#00f5ff",
                              border: "1px solid #00f5ff",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(0,245,255,0.12)")
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            disabled={deleteMutation.isPending}
                            style={{
                              padding: "0.35rem 0.6rem",
                              backgroundColor: "transparent",
                              color: "#ff006e",
                              border: "1px solid #ff006e",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(255,0,110,0.12)")
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div style={{ overflowX: "auto" }}>
            {ordersLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{
                      height: "56px",
                      backgroundColor: "#1a1f3a",
                      borderRadius: "0.35rem",
                      border: "1px solid #2a2f4a",
                    }}
                  />
                ))}
              </div>
            ) : allOrders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(0,245,255,0.5)",
                }}
              >
                No orders yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #2a2f4a" }}>
                    {[
                      "ORDER #",
                      "DATE",
                      "ITEMS",
                      "SUBTOTAL",
                      "TAX",
                      "TOTAL",
                      "STATUS",
                      "UPDATE",
                    ].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          color: "#00f5ff",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map(order => {
                    const items = (() => {
                      try {
                        return JSON.parse(order.items ?? "[]");
                      } catch {
                        return [];
                      }
                    })();
                    return (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: "1px solid #2a2f4a",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(0,245,255,0.03)")
                        }
                        onMouseLeave={e =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "#00f5ff",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          #{order.orderNumber}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "rgba(0,245,255,0.6)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "rgba(0,245,255,0.6)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {items.length}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "rgba(0,245,255,0.7)",
                            fontSize: "0.85rem",
                          }}
                        >
                          ${parseFloat(order.subtotal).toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "rgba(0,245,255,0.7)",
                            fontSize: "0.85rem",
                          }}
                        >
                          ${parseFloat(order.tax ?? "0").toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "#ff006e",
                            fontWeight: 700,
                          }}
                          className="neon-glow-pink"
                        >
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.55rem",
                              backgroundColor: `${statusColor(order.status)}20`,
                              color: statusColor(order.status),
                              borderRadius: "0.25rem",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <select
                            value={order.status}
                            onChange={e =>
                              updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                status: e.target
                                  .value as (typeof statusOptions)[number],
                              })
                            }
                            disabled={updateOrderStatusMutation.isPending}
                            style={{
                              backgroundColor: "#0a0e27",
                              color: "#00f5ff",
                              border: "1px solid #2a2f4a",
                              borderRadius: "0.25rem",
                              padding: "0.3rem 0.5rem",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            {statusOptions.map(s => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            {categories.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(0,245,255,0.5)",
                }}
              >
                <p>No categories yet. Add your first category!</p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    style={{
                      padding: "1.25rem",
                      backgroundColor: "#1a1f3a",
                      border: "1px solid #2a2f4a",
                      borderRadius: "0.35rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3 style={{ fontWeight: 700, color: "#00f5ff" }}>
                        {cat.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(0,245,255,0.4)",
                        }}
                      >
                        #{cat.id}
                      </span>
                    </div>
                    {cat.description && (
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(0,245,255,0.5)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {cat.description}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#b537f2",
                        fontFamily: "monospace",
                      }}
                    >
                      /{cat.slug}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
