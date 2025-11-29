import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// استيراد الصفحات
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Backup from './pages/Backup';

// استيراد المكونات
import Navbar from './components/Navbar';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/backup" element={<Backup />} />
            
            {/* صفحة 404 داخل التطبيق */}
            <Route path="*" element={
              <div className="text-center py-5">
                <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
                <h2>الصفحة غير موجودة</h2>
                <p>الصفحة التي تبحث عنها غير موجودة.</p>
                <a href="#/" className="btn btn-primary">العودة للرئيسية</a>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;