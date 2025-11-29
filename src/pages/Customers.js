import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // جلب العملاء من التخزين عند تحميل الصفحة
  useEffect(() => {
    const savedCustomers = storageService.load('customers');
    if (savedCustomers) {
      setCustomers(savedCustomers);
    }
  }, []);

  // حفظ العملاء في التخزين عند أي تغيير
  useEffect(() => {
    storageService.save('customers', customers);
  }, [customers]);

  const addCustomer = () => {
    if (name && phone) {
      const newCustomer = {
        id: Date.now(), // استخدام timestamp كمعرف فريد
        name: name,
        phone: phone,
        email: email || 'غير محدد',
        joinDate: new Date().toLocaleDateString('ar-EG'),
        totalPurchases: 0
      };
      
      // إضافة العميل للقائمة
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      
      // تفريغ الحقول
      setName('');
      setPhone('');
      setEmail('');
      
      console.log('تم إضافة العميل:', newCustomer);
      alert('تم إضافة العميل بنجاح!');
    } else {
      alert('الرجاء إدخال اسم العميل ورقم الهاتف');
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id));
      alert('تم حذف العميل بنجاح!');
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">
        <i className="fas fa-users me-2 text-primary"></i>
        إدارة العملاء
      </h2>
      
      {/* بطاقة إضافة عميل جديد */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title text-primary">
            <i className="fas fa-user-plus me-2"></i>
            إضافة عميل جديد
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">اسم العميل *</label>
              <input
                type="text"
                className="form-control"
                placeholder="أدخل اسم العميل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">رقم الهاتف *</label>
              <input
                type="text"
                className="form-control"
                placeholder="أدخل رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                className="form-control"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-12">
              <button 
                className="btn btn-primary px-4"
                onClick={addCustomer}
                disabled={!name || !phone}
              >
                <i className="fas fa-plus me-2"></i>
                إضافة عميل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات العملاء */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{customers.length}</h4>
              <p className="mb-0">إجمالي العملاء</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-user-plus fa-2x mb-2"></i>
              <h4>{customers.filter(c => c.joinDate === new Date().toLocaleDateString('ar-EG')).length}</h4>
              <p className="mb-0">عملاء جدد اليوم</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-envelope fa-2x mb-2"></i>
              <h4>{customers.filter(c => c.email !== 'غير محدد').length}</h4>
              <p className="mb-0">عملاء لديهم بريد إلكتروني</p>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة العملاء */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-list me-2 text-success"></i>
              قائمة العملاء ({customers.length})
            </span>
            <span className="badge bg-primary fs-6">
              {customers.length} عميل
            </span>
          </h5>

          {customers.length > 0 ? (
            <div className="row">
              {customers.map(customer => (
                <div key={customer.id} className="col-lg-6 mb-3">
                  <div className="card customer-card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="card-title text-primary mb-2">
                            <i className="fas fa-user me-2"></i>
                            {customer.name}
                          </h6>
                          
                          <div className="customer-details">
                            <p className="mb-1">
                              <i className="fas fa-phone me-2 text-muted"></i>
                              <strong>هاتف:</strong> {customer.phone}
                            </p>
                            
                            <p className="mb-1">
                              <i className="fas fa-envelope me-2 text-muted"></i>
                              <strong>بريد إلكتروني:</strong> {customer.email}
                            </p>
                            
                            <p className="mb-0">
                              <i className="fas fa-calendar me-2 text-muted"></i>
                              <strong>تاريخ التسجيل:</strong> {customer.joinDate}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => deleteCustomer(customer.id)}
                          title="حذف العميل"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-4x text-muted mb-3"></i>
              <h5 className="text-muted">لا يوجد عملاء مسجلين</h5>
              <p className="text-muted">استخدم النموذج أعلاه لإضافة عملاء جدد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;