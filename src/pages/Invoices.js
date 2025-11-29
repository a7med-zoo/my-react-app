import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('');

  // جلب البيانات من التخزين
  useEffect(() => {
    const savedInvoices = storageService.load('invoices');
    const savedCustomers = storageService.load('customers');
    const savedProducts = storageService.load('products');
    
    if (savedInvoices) setInvoices(savedInvoices);
    if (savedCustomers) setCustomers(savedCustomers);
    if (savedProducts) setProducts(savedProducts);
  }, []);

  // حفظ الفواتير عند التغيير
  useEffect(() => {
    storageService.save('invoices', invoices);
  }, [invoices]);

  const addInvoice = () => {
    if (customerName && amount) {
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: `INV-${Date.now()}`,
        customerName: customerName,
        productName: selectedProduct || 'منتجات متنوعة',
        quantity: quantity,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG'),
        status: 'مدفوعة'
      };
      
      setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
      
      // تفريغ الحقول
      setCustomerName('');
      setSelectedProduct('');
      setQuantity(1);
      setAmount('');
      
      console.log('تم إضافة الفاتورة:', newInvoice);
      alert('تم إضافة الفاتورة بنجاح!');
    } else {
      alert('الرجاء إدخال اسم العميل والمبلغ');
    }
  };

  const deleteInvoice = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
      alert('تم حذف الفاتورة بنجاح!');
    }
  };

  // حساب الإجماليات
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const todayInvoices = invoices.filter(inv => 
    inv.date === new Date().toLocaleDateString('ar-EG')
  ).length;

  return (
    <div>
      <h2 className="text-center mb-4">
        <i className="fas fa-file-invoice me-2 text-primary"></i>
        إدارة الفواتير
      </h2>
      
      {/* إحصائيات الفواتير */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice fa-2x mb-2"></i>
              <h4>{totalInvoices}</h4>
              <p className="mb-0">إجمالي الفواتير</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-money-bill-wave fa-2x mb-2"></i>
              <h4>{totalRevenue.toLocaleString()}</h4>
              <p className="mb-0">إجمالي المبيعات (ج.م)</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-calendar-day fa-2x mb-2"></i>
              <h4>{todayInvoices}</h4>
              <p className="mb-0">فواتير اليوم</p>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج إضافة فاتورة */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title text-primary">
            <i className="fas fa-plus-circle me-2"></i>
            إضافة فاتورة جديدة
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">اسم العميل *</label>
              <input
                type="text"
                className="form-control"
                placeholder="أدخل اسم العميل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                list="customersList"
                required
              />
              <datalist id="customersList">
                {customers.map(customer => (
                  <option key={customer.id} value={customer.name} />
                ))}
              </datalist>
            </div>
            
            <div className="col-md-3">
              <label className="form-label">المنتج</label>
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">اختر منتج</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>
                    {product.name} - {product.price} ج.م
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <label className="form-label">الكمية</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label">المبلغ الإجمالي *</label>
              <input
                type="number"
                className="form-control"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="col-12">
              <button 
                className="btn btn-success px-4"
                onClick={addInvoice}
                disabled={!customerName || !amount}
              >
                <i className="fas fa-file-invoice me-2"></i>
                إنشاء فاتورة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الفواتير */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-list me-2 text-success"></i>
              قائمة الفواتير ({invoices.length})
            </span>
            <span className="badge bg-primary fs-6">
              {invoices.length} فاتورة
            </span>
          </h5>

          {invoices.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>رقم الفاتورة</th>
                    <th>اسم العميل</th>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>المبلغ</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={invoice.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong className="text-primary">{invoice.invoiceNumber}</strong>
                      </td>
                      <td>
                        <i className="fas fa-user me-2 text-muted"></i>
                        {invoice.customerName}
                      </td>
                      <td>
                        <i className="fas fa-box me-2 text-muted"></i>
                        {invoice.productName}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{invoice.quantity}</span>
                      </td>
                      <td>
                        <strong className="text-success">{invoice.amount.toLocaleString()} ج.م</strong>
                      </td>
                      <td>
                        <small>
                          <i className="fas fa-calendar me-1 text-muted"></i>
                          {invoice.date}
                        </small>
                        <br />
                        <small className="text-muted">{invoice.time}</small>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          <i className="fas fa-check me-1"></i>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteInvoice(invoice.id)}
                          title="حذف الفاتورة"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-info">
                    <td colSpan="5" className="text-end">
                      <strong>الإجمالي:</strong>
                    </td>
                    <td colSpan="4">
                      <strong className="text-success fs-5">
                        {totalRevenue.toLocaleString()} ج.م
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center  py-5">
              <i className="fas fa-file-invoice fa-4x text-muted mb-3"></i>
              <h5 className="text-muted">لا توجد فواتير</h5>
              <p className="text-muted">استخدم النموذج أعلاه لإنشاء فواتير جديدة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;