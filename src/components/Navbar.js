import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container">
        <Link className="navbar-brand" to="/">
        <i className="fas fa-chart-line"></i> MicroManage
        </Link>
        
        <div className="navbar-nav">
        <Link className="nav-link" to="/">
            لوحة التحكم
        </Link>
        <Link className="nav-link" to="/products">
            المنتجات
        </Link>
        <Link className="nav-link" to="/customers">
            العملاء
        </Link>
        <Link className="nav-link" to="/reports">
        <i className="fas fa-chart-pie me-1"></i>
        التقارير
        </Link>
        </div>
    </div>
    </nav>
);
};

export default Navbar;