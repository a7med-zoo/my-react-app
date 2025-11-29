/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storage';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [printInvoice, setPrintInvoice] = useState(null);
  const componentRef = useRef();
  
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const savedInvoices = storageService.load('invoices');
    const savedCustomers = storageService.load('customers');
    const savedProducts = storageService.load('products');
    
    if (savedInvoices) setInvoices(savedInvoices);
    if (savedCustomers) setCustomers(savedCustomers);
    if (savedProducts) setProducts(savedProducts);
  }, []);

  useEffect(() => {
    storageService.save('invoices', invoices);
  }, [invoices]);

  const handlePrint = () => {
    if (printInvoice) {
      const printWindow = window.open('', '_blank');
      const invoiceContent = generateInvoiceHTML(printInvoice);
      
      printWindow.document.write(`
        <html>
          <head>
            <title>فاتورة ${printInvoice.invoiceNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                direction: rtl;
              }
              .invoice { border: 2px solid #333; padding: 20px; border-radius: 10px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { padding: 12px; border: 1px solid #ddd; text-align: center; }
              th { background-color: #34495e; color: white; }
              .total { background-color: #ecf0f1; font-weight: bold; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${invoiceContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    }
  };

  const generateInvoiceHTML = (invoice) => {
    const customer = customers.find(c => c.name === invoice.customerName);
    
    return `
      <div class="invoice">
        <div class="header">
          <h1>فاتورة بيع</h1>
          <h2 style="color: #3498db">MicroManage</h2>
          <p>نظام إدارة المشاريع الصغيرة</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="flex: 1">
            <h3>معلومات الفاتورة</h3>
            <p><strong>رقم الفاتورة:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>التاريخ:</strong> ${invoice.date}</p>
            <p><strong>الوقت:</strong> ${invoice.time}</p>
            <p><strong>الحالة:</strong> <span style="color: #27ae60">${invoice.status}</span></p>
          </div>
          
          <div style="flex: 1; text-align: left">
            <h3>معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${invoice.customerName}</p>
            <p><strong>الهاتف:</strong> ${customer?.phone || 'غير محدد'}</p>
            <p><strong>البريد الإلكتروني:</strong> ${customer?.email || 'غير محدد'}</p>
          </div>
        </div>

        <h3>تفاصيل المنتجات</h3>
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.productName}</td>
              <td>${(invoice.amount / invoice.quantity).toFixed(2)} ج.م</td>
              <td>${invoice.quantity}</td>
              <td><strong>${invoice.amount} ج.م</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
          <div style="width: 300px">
            <table>
              <tbody>
                <tr>
                  <td><strong>المجموع:</strong></td>
                  <td>${invoice.amount} ج.م</td>
                </tr>
                <tr>
                  <td><strong>الضريبة (14%):</strong></td>
                  <td>${(invoice.amount * 0.14).toFixed(2)} ج.م</td>
                </tr>
                <tr class="total">
                  <td><strong>الإجمالي النهائي:</strong></td>
                  <td style="color: #e74c3c">${(invoice.amount * 1.14).toFixed(2)} ج.م</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="margin-top: 40px; border-top: 2px solid #333; padding-top: 20px;">
          <p style="font-style: italic; color: #666">
            شكراً لتعاملكم معنا. يرجى الاحتفاظ بنسخة من هذه الفاتورة كإثبات للشراء.
          </p>
        </div>
      </div>
    `;
  };

  // تشغيل الطباعة تلقائياً
  useEffect(() => {
    if (printInvoice) {
      handlePrint();
      setTimeout(() => setPrintInvoice(null), 1000);
    }
  }, [printInvoice]);

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
      
      setCustomerName('');
      setSelectedProduct('');
      setQuantity(1);
      setAmount('');
      
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
      
      {/* ... باقي الكود كما هو ... */}
      
      {/* في جدول الفواتير، غير أزرار الإجراءات لتصبح: */}
      <td>
        <div className="btn-group btn-group-sm">
          <button 
            className="btn btn-info"
            onClick={() => setPrintInvoice(invoice)}
            title="طباعة الفاتورة"
          >
            <i className="fas fa-print"></i>
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => deleteInvoice(invoice.id)}
            title="حذف الفاتورة"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </div>
  );
};

export default Invoices;