import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import type { Product, Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Access Denied. Admins Only.</h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ShopEase Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className={`admin-nav-item ${location.pathname === '/admin/products' ? 'active' : ''}`}>
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/orders" className={`admin-nav-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link to="/admin/customers" className={`admin-nav-item ${location.pathname === '/admin/customers' ? 'active' : ''}`}>
            <Users size={20} /> Customers
          </Link>
          <Link to="/admin/settings" className={`admin-nav-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar shadow">
          <h2 className="admin-page-title">
            {location.pathname === '/admin' && 'Dashboard Overview'}
            {location.pathname === '/admin/products' && 'Products Management'}
            {location.pathname === '/admin/orders' && 'Orders'}
            {location.pathname === '/admin/customers' && 'Customers'}
          </h2>
          <div className="admin-profile">
            <span>{currentUser.full_name}</span>
            <div className="avatar">{currentUser.full_name.charAt(0)}</div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="*" element={<div style={{padding: '2rem'}}>Coming Soon</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const DashboardOverview = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, productsData] = await Promise.all([
          orderService.getAllOrders(),
          productService.getAllProducts({ limit: 100 })
        ]);
        setOrders(ordersData);
        setProducts(productsData.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} />;

  // Mocks stats for dashboard appearance using real lengths
  const totalRevenue = orders.reduce((acc, order) => acc + order.total_amount, 0);

  return (
    <div>
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card shadow">
          <div className="stat-icon" style={{color: 'var(--teal)'}}><ShoppingCart size={32} /></div>
          <h3>Total Revenue</h3>
          <p className="stat-value" style={{color: 'var(--teal)'}}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card shadow">
          <div className="stat-icon" style={{color: 'var(--primary-navy)'}}><ShoppingCart size={32} /></div>
          <h3>Total Orders</h3>
          <p className="stat-value" style={{color: 'var(--primary-navy)'}}>{orders.length}</p>
        </div>
        <div className="stat-card shadow">
          <div className="stat-icon" style={{color: 'var(--gold)'}}><Package size={32} /></div>
          <h3>Total Products</h3>
          <p className="stat-value" style={{color: 'var(--gold)'}}>{products.length}</p>
        </div>
        <div className="stat-card shadow">
          <div className="stat-icon" style={{color: 'var(--deep-blue)'}}><Users size={32} /></div>
          <h3>Total Customers</h3>
          <p className="stat-value" style={{color: 'var(--deep-blue)'}}>2</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="recent-orders shadow">
          <h3>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.created_at || new Date()).toLocaleDateString()}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      style={{ padding: '0.2rem', borderRadius: '4px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="top-products shadow">
          <h3>Top Products by Sales</h3>
          <div className="top-products-list">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="top-product-item">
                <img src={p.image_url} alt={p.name} />
                <div className="top-product-info">
                  <h4>{p.name}</h4>
                  <p>{p.category}</p>
                </div>
                <div className="top-product-revenue">${p.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
      alert('Status updated successfully');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--gold)';
      case 'processing': return 'var(--primary-navy)';
      case 'shipped': return 'var(--teal)';
      case 'delivered': return 'var(--success-green, green)';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="orders-table-container shadow">
        {orders.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center'}}>No orders yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Email</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Items Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id.substring(0, 8)}</td>
                  <td>{o.user?.email || o.shipping_address?.email || 'N/A'}</td>
                  <td>{new Date(o.created_at || new Date()).toLocaleDateString('en-GB')}</td>
                  <td>${o.total_amount.toFixed(2)}</td>
                  <td>{o.order_items ? o.order_items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0}</td>
                  <td>
                    <select 
                      value={o.status} 
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      style={{ 
                        padding: '0.4rem', 
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: getStatusColor(o.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      <option value="pending" style={{color: 'black'}}>pending</option>
                      <option value="processing" style={{color: 'black'}}>processing</option>
                      <option value="shipped" style={{color: 'black'}}>shipped</option>
                      <option value="delivered" style={{color: 'black'}}>delivered</option>
                      <option value="cancelled" style={{color: 'black'}}>cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts({ limit: 100 });
      setProducts(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await productService.createProduct(formData);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      await productService.updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
      fetchProducts();
      alert('Product updated successfully!');
    } catch (err) {
      alert('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity
    });
    setEditingProduct(product);
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="admin-products-page">
      <div className="page-actions" style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem'}}>
        <button className="btn-primary" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}} onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {(showModal || editingProduct) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <form className="shadow" style={{background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '400px'}} onSubmit={editingProduct ? handleEdit : handleCreate}>
            <h3>{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <input placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '0.5rem'}} />
              <input placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{padding: '0.5rem'}} />
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{padding: '0.5rem'}}>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Sports">Sports</option>
              </select>
              <input placeholder="Image URL" required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{padding: '0.5rem'}} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="number" placeholder="Price" required step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{padding: '0.5rem'}} />
                <input type="number" placeholder="Stock" required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})} style={{padding: '0.5rem'}} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" onClick={() => { setShowModal(false); setEditingProduct(null); }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container shadow">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <img src={p.image_url} alt={p.name} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock_quantity}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="action-btn edit" title="Edit" onClick={() => startEdit(p)} style={{backgroundColor: 'var(--teal)', color: 'white', padding: '0.4rem', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Edit size={18} /></button>
                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

