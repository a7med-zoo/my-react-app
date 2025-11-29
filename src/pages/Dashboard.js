import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    recentActivity: []
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const products = storageService.load('products') || [];
    const customers = storageService.load('customers') || [];
    const invoices = storageService.load('invoices') || [];

    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
    const lowStockProducts = products.filter(product => product.quantity < 5).length;

    const recentActivity = [
      ...products.slice(-3).map(p => ({ type: 'product', item: p, time: p.createdAt })),
      ...customers.slice(-2).map(c => ({ type: 'customer', item: c, time: c.joinDate })),
      ...invoices.slice(-2).map(i => ({ type: 'invoice', item: i, time: i.date }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    setStats({
      totalProducts: products.length,
      totalCustomers: customers.length,
      totalInvoices: invoices.length,
      totalRevenue: totalRevenue,
      lowStockProducts: lowStockProducts,
      recentActivity: recentActivity
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'product': return 'fas fa-box text-primary';
      case 'customer': return 'fas fa-user text-success';
      case 'invoice': return 'fas fa-file-invoice text-warning';
      default: return 'fas fa-info-circle text-info';
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'product':
        return `تم إضافة منتج: ${activity.item.name}`;
      case 'customer':
        return `تم إضافة عميل: ${activity.item.name}`;
      case 'invoice':
        return `تم إنشاء فاتورة: ${activity.item.customerName} - ${activity.item.amount} ج.م`;
      default:
        return 'نشاط جديد';
    }
  };

  return (
    <div>
      {/* العنوان الرئيسي */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-3">
            <i className="fas fa-tachometer-alt me-2"></i>
            لوحة تحكم MicroManage
          </h1>
          <p className="text-center text-muted fs-5">
            <i className="fas fa-chart-line me-2"></i>
            نظام متكامل لإدارة المشروعات الصغيرة
          </p>
        </div>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="row mt-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-boxes fa-3x mb-3"></i>
              <h3 className="card-title">{stats.totalProducts}</h3>
              <p className="card-text mb-0">
                <i className="fas fa-cube me-1"></i>
                إجمالي المنتجات
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h3 className="card-title">{stats.totalCustomers}</h3>
              <p className="card-text mb-0">
                <i className="fas fa-user me-1"></i>
                إجمالي العملاء
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice-dollar fa-3x mb-3"></i>
              <h3 className="card-title">{stats.totalInvoices}</h3>
              <p className="card-text mb-0">
                <i className="fas fa-receipt me-1"></i>
                إجمالي الفواتير
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-money-bill-wave fa-3x mb-3"></i>
              <h3 className="card-title">{stats.totalRevenue.toLocaleString()}</h3>
              <p className="card-text mb-0">
                <i className="fas fa-chart-line me-1"></i>
                إجمالي المبيعات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات والنشاط الحديث */}
      <div className="row mt-4">
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between align-items-center">
                <span>
                  <i className="fas fa-chart-bar me-2 text-primary"></i>
                  الإحصائيات السريعة
                </span>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={calculateStats}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  تحديث
                </button>
              </h5>
              
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                    منتجات كميتها منخفضة
                  </div>
                  <span className="badge bg-warning rounded-pill fs-6">
                    {stats.lowStockProducts}
                  </span>
                </div>
                
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-box text-primary me-2"></i>
                    متوسط سعر المنتج
                  </div>
                  <span className="badge bg-primary rounded-pill fs-6">
                    {stats.totalProducts > 0 ? 
                      (stats.totalRevenue / stats.totalProducts).toFixed(0) : 0
                    } ج.م
                  </span>
                </div>
                
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-chart-line text-success me-2"></i>
                    متوسط قيمة الفاتورة
                  </div>
                  <span className="badge bg-success rounded-pill fs-6">
                    {stats.totalInvoices > 0 ? 
                      (stats.totalRevenue / stats.totalInvoices).toFixed(0) : 0
                    } ج.م
                  </span>
                </div>
                
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-user-check text-info me-2"></i>
                    عملاء جدد هذا الشهر
                  </div>
                  <span className="badge bg-info rounded-pill fs-6">
                    {stats.totalCustomers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-clock me-2 text-success"></i>
                النشاط الحديث
              </h5>
              
              {stats.recentActivity.length > 0 ? (
                <div className="activity-timeline">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item d-flex align-items-center mb-3 p-2 rounded">
                      <div className="activity-icon me-3">
                        <i className={`${getActivityIcon(activity.type)} fa-lg`}></i>
                      </div>
                      <div className="activity-content flex-grow-1">
                        <p className="mb-1 fw-medium">{getActivityText(activity)}</p>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {activity.time}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">لا يوجد نشاط حديث</p>
                  <p className="text-muted small">سيظهر النشاط هنا عند إضافة بيانات جديدة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* بطاقات التنقل السريع - معدل */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-rocket me-2 text-primary"></i>
                التنقل السريع
              </h5>
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <Link to="/products" className="btn btn-outline-primary btn-lg w-100 py-3">
                    <i className="fas fa-plus-circle fa-2x mb-2 d-block"></i>
                    إضافة منتج
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/customers" className="btn btn-outline-success btn-lg w-100 py-3">
                    <i className="fas fa-user-plus fa-2x mb-2 d-block"></i>
                    إضافة عميل
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/invoices" className="btn btn-outline-warning btn-lg w-100 py-3">
                    <i className="fas fa-file-invoice-dollar fa-2x mb-2 d-block"></i>
                    إنشاء فاتورة
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info btn-lg w-100 py-3" onClick={calculateStats}>
                    <i className="fas fa-sync-alt fa-2x mb-2 d-block"></i>
                    تحديث البيانات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;