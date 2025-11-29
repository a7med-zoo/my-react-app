/* eslint-disable react-hooks/exhaustive-deps */
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReports();
  }, [dateRange]);

  const generateReports = () => {
    setLoading(true);
    
    // محاكاة delay بسيط
    setTimeout(() => {
      try {
        const invoices = storageService.load('invoices') || [];
        const products = storageService.load('products') || [];
        const customers = storageService.load('customers') || [];

        console.log('البيانات المحملة:', { invoices, products, customers });

        // تقرير المبيعات
        const salesReport = invoices
          .filter(invoice => {
            try {
              const invoiceDate = new Date(invoice.date);
              const startDate = new Date(dateRange.start);
              const endDate = new Date(dateRange.end);
              return invoiceDate >= startDate && invoiceDate <= endDate;
            } catch (error) {
              console.error('خطأ في تصفية التاريخ:', error);
              return true;
            }
          })
          .map(invoice => ({
            ...invoice,
            date: invoice.date || new Date().toLocaleDateString('ar-EG')
          }));

        // تقرير المنتجات
        const productsReport = products.map(product => ({
          id: product.id,
          name: product.name || 'غير معروف',
          price: product.price || 0,
          quantity: product.quantity || 0,
          category: product.category || 'عام',
          totalValue: (product.price || 0) * (product.quantity || 0),
          status: (product.quantity || 0) === 0 ? 'نافذ' : 
                  (product.quantity || 0) < 5 ? 'منخفض' : 'متوفر'
        }));

        // تقرير العملاء
        const customersReport = customers.map(customer => {
          const customerInvoices = invoices.filter(inv => 
            inv.customerName === customer.name
          );
          const totalSpent = customerInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
          
          return {
            id: customer.id,
            name: customer.name || 'غير معروف',
            phone: customer.phone || 'غير محدد',
            email: customer.email || 'غير محدد',
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

        console.log('التقارير المولدة:', { salesReport, productsReport, customersReport });
        
      } catch (error) {
        console.error('خطأ في توليد التقارير:', error);
        alert('حدث خطأ في توليد التقارير: ' + error.message);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    try {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(value => 
          `"${String(value || '').replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('خطأ في التصدير:', error);
      alert('حدث خطأ في تصدير البيانات');
    }
  };

  // حساب الإحصائيات
  const totalSales = reports.sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const totalInvoices = reports.sales.length;
  const totalProducts = reports.products.length;
  const totalCustomers = reports.customers.length;

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
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={generateReports}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt me-1"></i>
                      تحديث
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => exportToCSV(reports.sales, 'تقرير_المبيعات')}
                  disabled={reports.sales.length === 0}
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
              <h4>{totalSales.toLocaleString()}</h4>
              <p className="mb-0">إجمالي المبيعات</p>
              <small>{totalInvoices} فاتورة</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice fa-2x mb-2"></i>
              <h4>{totalInvoices}</h4>
              <p className="mb-0">عدد الفواتير</p>
              <small>في الفترة المحددة</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-box fa-2x mb-2"></i>
              <h4>{totalProducts}</h4>
              <p className="mb-0">إجمالي المنتجات</p>
              <small>في المخزن</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{totalCustomers}</h4>
              <p className="mb-0">إجمالي العملاء</p>
              <small>مسجلين في النظام</small>
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
              <span className="badge bg-secondary ms-2">{reports.sales.length}</span>
            </h5>
            <button 
              className="btn btn-outline-success btn-sm"
              onClick={() => exportToCSV(reports.sales, 'تقرير_المبيعات')}
              disabled={reports.sales.length === 0}
            >
              <i className="fas fa-download me-1"></i>
              تصدير Excel
            </button>
          </div>
          
          {reports.sales.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
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
                    <tr key={sale.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong className="text-primary">{sale.invoiceNumber || 'غير معروف'}</strong>
                      </td>
                      <td>{sale.customerName || 'غير معروف'}</td>
                      <td>{sale.productName || 'منتجات متنوعة'}</td>
                      <td>
                        <span className="badge bg-secondary">{sale.quantity || 1}</span>
                      </td>
                      <td className="text-success fw-bold">
                        {(sale.amount || 0).toLocaleString()} ج.م
                      </td>
                      <td>{sale.date}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-primary">
                  <tr>
                    <td colSpan="5" className="text-end fw-bold">الإجمالي:</td>
                    <td colSpan="2" className="fw-bold">
                      {totalSales.toLocaleString()} ج.م
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">لا توجد مبيعات في الفترة المحددة</h5>
              <p className="text-muted">قم بإنشاء فواتير جديدة أو غيّر نطاق التاريخ</p>
            </div>
          )}
        </div>
      </div>

      {/* تقرير المنتجات */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              <i className="fas fa-boxes me-2 text-warning"></i>
              تقرير المنتجات
              <span className="badge bg-secondary ms-2">{reports.products.length}</span>
            </h5>
            <button 
              className="btn btn-outline-warning btn-sm"
              onClick={() => exportToCSV(reports.products, 'تقرير_المنتجات')}
              disabled={reports.products.length === 0}
            >
              <i className="fas fa-download me-1"></i>
              تصدير Excel
            </button>
          </div>
          
          {reports.products.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
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
                    <tr key={product.id || index}>
                      <td className="fw-medium">{product.name}</td>
                      <td>
                        <span className="badge bg-info">{product.category}</span>
                      </td>
                      <td>{product.price} ج.م</td>
                      <td>
                        <span className={`badge ${
                          product.quantity === 0 ? 'bg-danger' : 
                          product.quantity < 5 ? 'bg-warning' : 'bg-success'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">
                        {product.totalValue.toLocaleString()} ج.م
                      </td>
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
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-boxes fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">لا توجد منتجات</h5>
              <p className="text-muted">قم بإضافة منتجات لعرضها في التقرير</p>
            </div>
          )}
        </div>
      </div>

      {/* تقرير العملاء */}
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              <i className="fas fa-users me-2 text-info"></i>
              تقرير العملاء
              <span className="badge bg-secondary ms-2">{reports.customers.length}</span>
            </h5>
            <button 
              className="btn btn-outline-info btn-sm"
              onClick={() => exportToCSV(reports.customers, 'تقرير_العملاء')}
              disabled={reports.customers.length === 0}
            >
              <i className="fas fa-download me-1"></i>
              تصدير Excel
            </button>
          </div>
          
          {reports.customers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
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
                    <tr key={customer.id || index}>
                      <td className="fw-medium">{customer.name}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.email}</td>
                      <td>
                        <span className="badge bg-primary">{customer.totalInvoices}</span>
                      </td>
                      <td className="text-success fw-bold">
                        {customer.totalSpent.toLocaleString()} ج.م
                      </td>
                      <td>{customer.lastPurchase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">لا توجد عملاء</h5>
              <p className="text-muted">قم بإضافة عملاء لعرضهم في التقرير</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;