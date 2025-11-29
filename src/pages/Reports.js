/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const Reports = () => {
  const [reports, setReports] = useState({
    sales: [],
    products: [],
    customers: []
  });
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    generateReports();
  }, [dateRange, generateReports]);

  const generateReports = () => {
    const invoices = storageService.load('invoices') || [];
    const products = storageService.load('products') || [];
    const customers = storageService.load('customers') || [];

    // تقرير المبيعات
    const salesReport = invoices
      .filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      })
      .map(invoice => ({
        ...invoice,
        date: new Date(invoice.date).toLocaleDateString('ar-EG')
      }));

    // تقرير المنتجات
    const productsReport = products.map(product => ({
      ...product,
      totalValue: product.price * product.quantity,
      status: product.quantity === 0 ? 'نافذ' : product.quantity < 5 ? 'منخفض' : 'متوفر'
    }));

    // تقرير العملاء
    const customersReport = customers.map(customer => {
      const customerInvoices = invoices.filter(inv => inv.customerName === customer.name);
      const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      
      return {
        ...customer,
        totalInvoices: customerInvoices.length,
        totalSpent: totalSpent,
        lastPurchase: customerInvoices.length > 0 ? 
          customerInvoices[customerInvoices.length - 1].date : 'لا يوجد'
      };
    });

    setReports({
      sales: salesReport,
      products: productsReport,
      customers: customersReport
    });
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-center mb-4">
        <i className="fas fa-chart-pie me-2 text-primary"></i>
        التقارير والإحصائيات
      </h2>

      {/* فلترة التاريخ */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-filter me-2 text-primary"></i>
            فلترة التقارير
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">من تاريخ</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">إلى تاريخ</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">الإجراءات</label>
              <div>
                <button 
                  className="btn btn-primary me-2"
                  onClick={generateReports}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  تحديث
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => exportToCSV(reports.sales, 'تقرير_المبيعات')}
                >
                  <i className="fas fa-download me-1"></i>
                  تصدير
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-money-bill-wave fa-2x mb-2"></i>
              <h4>{reports.sales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}</h4>
              <p className="mb-0">إجمالي المبيعات</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice fa-2x mb-2"></i>
              <h4>{reports.sales.length}</h4>
              <p className="mb-0">عدد الفواتير</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-box fa-2x mb-2"></i>
              <h4>{reports.products.length}</h4>
              <p className="mb-0">إجمالي المنتجات</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{reports.customers.length}</h4>
              <p className="mb-0">إجمالي العملاء</p>
            </div>
          </div>
        </div>
      </div>

      {/* تقرير المبيعات */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              <i className="fas fa-chart-line me-2 text-success"></i>
              تقرير المبيعات
            </h5>
            <button 
              className="btn btn-outline-success btn-sm"
              onClick={() => exportToCSV(reports.sales, 'تقرير_المبيعات')}
            >
              <i className="fas fa-download me-1"></i>
              تصدير Excel
            </button>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>العميل</th>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>المبلغ</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {reports.sales.map((sale, index) => (
                  <tr key={sale.id}>
                    <td>{sale.invoiceNumber}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.productName}</td>
                    <td>{sale.quantity}</td>
                    <td className="text-success fw-bold">{sale.amount.toLocaleString()} ج.م</td>
                    <td>{sale.date}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-primary">
                  <td colSpan="4" className="text-end fw-bold">الإجمالي:</td>
                  <td colSpan="2" className="fw-bold">
                    {reports.sales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()} ج.م
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* تقرير المنتجات */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-boxes me-2 text-warning"></i>
            تقرير المنتجات
          </h5>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>اسم المنتج</th>
                  <th>الفئة</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>القيمة الإجمالية</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {reports.products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price} ج.م</td>
                    <td>{product.quantity}</td>
                    <td className="fw-bold">{product.totalValue.toLocaleString()} ج.م</td>
                    <td>
                      <span className={`badge ${
                        product.status === 'متوفر' ? 'bg-success' : 
                        product.status === 'منخفض' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* تقرير العملاء */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-users me-2 text-info"></i>
            تقرير العملاء
          </h5>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>اسم العميل</th>
                  <th>الهاتف</th>
                  <th>البريد الإلكتروني</th>
                  <th>عدد الفواتير</th>
                  <th>إجمالي المشتريات</th>
                  <th>آخر شراء</th>
                </tr>
              </thead>
              <tbody>
                {reports.customers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>
                      <span className="badge bg-primary">{customer.totalInvoices}</span>
                    </td>
                    <td className="text-success fw-bold">{customer.totalSpent.toLocaleString()} ج.م</td>
                    <td>{customer.lastPurchase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;