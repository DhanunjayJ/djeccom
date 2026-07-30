import { useEffect, useState } from "react";
import { Archive, ClipboardList, PackagePlus, RotateCcw, Shield, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  archiveAdminProductApi,
  createAdminProductApi,
  getAdminProductsApi,
  getAdminUsersApi,
  getAuditLogsApi,
  restoreAdminProductApi,
  updateAdminProductApi,
  updateUserRoleApi,
} from "../http";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  category: "",
  stockQuantity: "",
  imageUrl: "",
};

const ROLES = ["CUSTOMER", "SUPPORT", "FULFILLMENT", "ADMIN"];

export default function AdminConsole() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAdminProductsApi(),
      getAdminUsersApi(),
      getAuditLogsApi(),
    ])
      .then(([productData, userData, auditData]) => {
        if (cancelled) return;
        setProducts(productData);
        setUsers(userData);
        setAuditLogs(auditData);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setProductForm(EMPTY_PRODUCT);
    setEditingId(null);
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity),
    };

    try {
      if (editingId) {
        await updateAdminProductApi(editingId, payload);
        toast.success("Product updated");
      } else {
        await createAdminProductApi(payload);
        toast.success("Product created");
      }
      resetForm();
      setProducts(await getAdminProductsApi());
      setAuditLogs(await getAuditLogsApi());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      category: product.category ?? "",
      stockQuantity: product.stockQuantity ?? "",
      imageUrl: product.imageUrl ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleArchive = async (product) => {
    try {
      if (product.active) {
        if (!window.confirm(`Archive "${product.name}"?`)) return;
        await archiveAdminProductApi(product.id);
        toast.success("Product archived");
      } else {
        await restoreAdminProductApi(product.id);
        toast.success("Product restored");
      }
      setProducts(await getAdminProductsApi());
      setAuditLogs(await getAuditLogsApi());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      const updatedUser = await updateUserRoleApi(userId, role);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? updatedUser : user)),
      );
      setAuditLogs(await getAuditLogsApi());
      toast.success("Role updated. The user must log in again.");
    } catch (error) {
      toast.error(error.message);
      setUsers(await getAdminUsersApi());
    }
  };

  const tabs = [
    { id: "products", label: "Products", icon: PackagePlus },
    { id: "staff", label: "Users & roles", icon: Users },
    { id: "audit", label: "Audit log", icon: ClipboardList },
  ];

  if (loading) {
    return <div className="py-24 text-center font-semibold dark:text-white">Loading admin console…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">Store administration</p>
        <h1 className="mt-2 text-3xl font-black text-black dark:text-white">Admin Console</h1>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-2 dark:bg-zinc-900">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === id
                ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={submitProduct}
            className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-xl font-black dark:text-white">
              {editingId ? "Edit product" : "Add product"}
            </h2>
            {[
              ["name", "Product name", "text"],
              ["category", "Category", "text"],
              ["price", "Price", "number"],
              ["stockQuantity", "Stock quantity", "number"],
              ["imageUrl", "Image URL", "url"],
            ].map(([name, label, type]) => (
              <label key={name} className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {label}
                <input
                  name={name}
                  type={type}
                  min={type === "number" ? "0" : undefined}
                  step={name === "price" ? "0.01" : undefined}
                  value={productForm[name]}
                  onChange={handleProductChange}
                  required
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 outline-none focus:border-black dark:border-zinc-700 dark:text-white"
                />
              </label>
            ))}
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Description
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                rows="4"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 outline-none focus:border-black dark:border-zinc-700 dark:text-white"
              />
            </label>
            <div className="flex gap-2">
              <button
                disabled={saving}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-xl border px-4 text-sm font-bold dark:border-zinc-700 dark:text-white">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:bg-zinc-900 ${
                  product.active ? "border-gray-100 dark:border-zinc-800" : "border-amber-200 opacity-70 dark:border-amber-900"
                }`}
              >
                <img src={product.imageUrl} alt="" className="h-20 w-20 rounded-xl bg-gray-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-black dark:text-white">{product.name}</h3>
                    {!product.active && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Archived</span>}
                  </div>
                  <p className="text-sm text-gray-500">{product.category} · ₹{product.price} · {product.stockQuantity} in stock</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editProduct(product)} className="rounded-xl border px-3 py-2 text-sm font-bold dark:border-zinc-700 dark:text-white">Edit</button>
                  <button
                    onClick={() => toggleArchive(product)}
                    className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-bold dark:border-zinc-700 dark:text-white"
                  >
                    {product.active ? <Archive className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    {product.active ? "Archive" : "Restore"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "staff" && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 border-b p-5 last:border-0 sm:flex-row sm:items-center dark:border-zinc-800">
              <div className="flex-1">
                <p className="font-black dark:text-white">{user.userName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold dark:text-white">
                <Shield className="h-4 w-4" />
                <select
                  value={user.role}
                  onChange={(event) => changeRole(user.id, event.target.value)}
                  className="rounded-xl border bg-transparent px-3 py-2 dark:border-zinc-700"
                >
                  {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black dark:text-white">{log.action}</p>
                <time className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</time>
              </div>
              <p className="mt-1 text-sm text-gray-500">{log.actorEmail} · {log.actorRole}</p>
              <p className="mt-2 text-sm dark:text-zinc-300">{log.entityType} #{log.entityId}: {log.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
