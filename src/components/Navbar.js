import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* الشعار وزر القائمة */}
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
          <i className="fas fa-chart-line me-2"></i>
          <span className="d-none d-sm-inline">MicroManage</span>
          <span className="d-inline d-sm-none">MM</span>
        </Link>

        {/* جرس الإشعارات - خارج القائمة */}
        <div className="d-flex align-items-center">
          <NotificationBell />
          
          {/* زر القائمة للموبايل */}
          <button 
            className="navbar-toggler ms-2"
            type="button"
            onClick={toggleMenu}
            aria-label="تبديل القائمة"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* محتوى القائمة */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            {/* لوحة التحكم */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/"
                onClick={closeMenu}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                <span className="d-none d-md-inline">لوحة التحكم</span>
                <span className="d-inline d-md-none">الرئيسية</span>
              </Link>
            </li>

            {/* المنتجات */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/products"
                onClick={closeMenu}
              >
                <i className="fas fa-boxes me-2"></i>
                <span className="d-none d-md-inline">المنتجات</span>
                <span className="d-inline d-md-none">المنتجات</span>
              </Link>
            </li>

            {/* العملاء */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/customers"
                onClick={closeMenu}
              >
                <i className="fas fa-users me-2"></i>
                <span className="d-none d-md-inline">العملاء</span>
                <span className="d-inline d-md-none">العملاء</span>
              </Link>
            </li>

            {/* الفواتير */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/invoices"
                onClick={closeMenu}
              >
                <i className="fas fa-file-invoice me-2"></i>
                <span className="d-none d-md-inline">الفواتير</span>
                <span className="d-inline d-md-none">الفواتير</span>
              </Link>
            </li>

            {/* التقارير */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/reports"
                onClick={closeMenu}
              >
                <i className="fas fa-chart-pie me-2"></i>
                <span className="d-none d-md-inline">التقارير</span>
                <span className="d-inline d-md-none">التقارير</span>
              </Link>
            </li>

            {/* النسخ الاحتياطي */}
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/backup"
                onClick={closeMenu}
              >
                <i className="fas fa-database me-2"></i>
                <span className="d-none d-md-inline">النسخ الاحتياطي</span>
                <span className="d-inline d-md-none">النسخ</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;