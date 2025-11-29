import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import SearchBar from '../components/SearchBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productCategory, setProductCategory] = useState('عام');
  const [searchTerm, setSearchTerm] = useState('');

  // جلب المنتجات من التخزين
  useEffect(() => {
    const savedProducts = storageService.load('products') || [];
    setProducts(savedProducts);
    setFilteredProducts(savedProducts);
  }, []);

  // حفظ المنتجات عند التغيير
  useEffect(() => {
    storageService.save('products', products);
  }, [products]);

  // البحث والتصفية
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const addProduct = () => {
    if (productName && productPrice && productQuantity) {
      const newProduct = {
        id: Date.now(),
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
        category: productCategory,
        createdAt: new Date().toLocaleString('ar-EG')
      };
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      
      setProductName('');
      setProductPrice('');
      setProductQuantity('');
      setProductCategory('عام');
      
      alert('تم إضافة المنتج بنجاح!');
    } else {
      alert('الرجاء ملء جميع الحقول المطلوبة');
    }
  };

  const deleteProduct = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(product => product.id !== id));
      alert('تم حذف المنتج بنجاح!');
    }
  };

  const updateQuantity = (id, newQuantity) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    ));
  };

  return (
    <div>
      <h2 className="text-center mb-4">
        <i className="fas fa-boxes me-2 text-primary"></i>
        إدارة المنتجات
      </h2>

      {/* إحصائيات سريعة */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center py-3">
              <h4>{products.length}</h4>
              <p className="mb-0">إجمالي المنتجات</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center py-3">
              <h4>{products.reduce((sum, p) => sum + p.quantity, 0)}</h4>
              <p className="mb-0">إجمالي الكمية</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center py-3">
              <h4>{products.filter(p => p.quantity < 5).length}</h4>
              <p className="mb-0">منتجات منخفضة</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center py-3">
              <h4>{products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</h4>
              <p className="mb-0">إجمالي القيمة</p>
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث */}
      <SearchBar
        placeholder="ابحث عن منتج..."
        onSearch={setSearchTerm}
        onFilter={(filter) => console.log('Filter:', filter)}
      />

      {/* نموذج إضافة منتج */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title text-primary">
            <i className="fas fa-plus-circle me-2"></i>
            إضافة منتج جديد
          </h5>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="اسم المنتج"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="السعر"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="الكمية"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="عام">عام</option>
                <option value="إلكترونيات">إلكترونيات</option>
                <option value="ملابس">ملابس</option>
                <option value="مواد غذائية">مواد غذائية</option>
                <option value="أدوات منزلية">أدوات منزلية</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-primary w-100"
                onClick={addProduct}
                disabled={!productName || !productPrice || !productQuantity}
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-list me-2 text-success"></i>
              قائمة المنتجات ({filteredProducts.length})
            </span>
            <div>
              <span className="badge bg-primary me-2">
                {filteredProducts.length} منتج
              </span>
              <span className="badge bg-success">
                {products.length - filteredProducts.length} مخفي
              </span>
            </div>
          </h5>

          {filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map(product => (
                <div key={product.id} className="col-xl-4 col-md-6 mb-3">
                  <div className="card product-card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="card-title text-primary mb-0">
                          {product.name}
                        </h6>
                        <span className="badge bg-secondary">
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="product-details">
                        <p className="mb-2">
                          <i className="fas fa-tag me-2 text-muted"></i>
                          <strong>السعر:</strong> {product.price} ج.م
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>
                            <i className="fas fa-box me-2 text-muted"></i>
                            <strong>الكمية:</strong>
                          </span>
                          <div className="quantity-controls">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, product.quantity - 1)}
                              disabled={product.quantity <= 0}
                            >
                              -
                            </button>
                            <span className="mx-2 fw-bold">
                              {product.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, product.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <p className="mb-0 text-muted small">
                          <i className="fas fa-clock me-1"></i>
                          {product.createdAt}
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        <button 
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <i className="fas fa-trash me-1"></i>
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search fa-4x text-muted mb-3"></i>
              <h5 className="text-muted">
                {products.length > 0 ? 'لم يتم العثور على منتجات' : 'لا توجد منتجات'}
              </h5>
              <p className="text-muted">
                {products.length > 0 ? 'جرب مصطلحات بحث أخرى' : 'استخدم النموذج أعلاه لإضافة منتجات'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;