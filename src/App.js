/* eslint-disable import/first */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './App.css';


// في imports أضف:
import Reports from './pages/Reports';

// في الـ Routes أضف:
<Route path="/reports" element={<Reports />} />

// استيراد الصفحات
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';

// استيراد المكونات
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
    </div>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </div>
      
    </Router>
  );
}

export default App;