import React from 'react';

const InvoicePrint = React.forwardRef(({ invoice, customer, products }, ref) => {
  if (!invoice) return null;

  const getProductDetails = (productName) => {
    return products?.find(p => p.name === productName) || { price: invoice.amount / invoice.quantity };
  };

  return (
    <div ref={ref} style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      direction: 'rtl',
      border: '2px solid #333',
      borderRadius: '10px',
      backgroundColor: 'white'
    }}>
      {/* رأس الفاتورة */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: '0' }}>فاتورة بيع</h1>
        <h2 style={{ color: '#3498db', margin: '10px 0' }}>MicroManage</h2>
        <p style={{ margin: '5px 0', color: '#666' }}>نظام إدارة المشاريع الصغيرة</p>
      </div>

      {/* معلومات الفاتورة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#2c3e50', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>معلومات الفاتورة</h3>
          <p><strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}</p>
          <p><strong>التاريخ:</strong> {invoice.date}</p>
          <p><strong>الوقت:</strong> {invoice.time}</p>
          <p><strong>الحالة:</strong> <span style={{ color: '#27ae60' }}>{invoice.status}</span></p>
        </div>
        
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h3 style={{ color: '#2c3e50', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>معلومات العميل</h3>
          <p><strong>الاسم:</strong> {invoice.customerName}</p>
          <p><strong>الهاتف:</strong> {customer?.phone || 'غير محدد'}</p>
          <p><strong>البريد الإلكتروني:</strong> {customer?.email || 'غير محدد'}</p>
        </div>
      </div>

      {/* تفاصيل المنتجات */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2c3e50', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>تفاصيل المنتجات</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>المنتج</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>السعر</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>الكمية</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                {invoice.productName}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                {getProductDetails(invoice.productName).price} ج.م
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                {invoice.quantity}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
                {invoice.amount} ج.م
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* المجموع والإجمالي */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <div style={{ width: '300px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}><strong>المجموع:</strong></td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{invoice.amount} ج.م</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}><strong>الضريبة (14%):</strong></td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{(invoice.amount * 0.14).toFixed(2)} ج.م</td>
              </tr>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}><strong>الإجمالي النهائي:</strong></td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#e74c3c' }}>
                  {(invoice.amount * 1.14).toFixed(2)} ج.م
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ملاحظات وتوقيع */}
      <div style={{ marginTop: '40px', borderTop: '2px solid #333', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              شكراً لتعاملكم معنا. يرجى الاحتفاظ بنسخة من هذه الفاتورة كإثبات للشراء.
            </p>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', width: '200px', margin: '0 auto', paddingTop: '10px' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>التوقيع</p>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>مدير المبيعات</p>
            </div>
          </div>
        </div>
      </div>

      {/* تذييل الفاتورة */}
      <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '15px', color: '#666', fontSize: '12px' }}>
        <p style={{ margin: '5px 0' }}>MicroManage - نظام إدارة المشاريع الصغيرة</p>
        <p style={{ margin: '5px 0' }}>هاتف: 0123456789 | البريد الإلكتروني: info@micromanage.com</p>
        <p style={{ margin: '5px 0' }}>جميع الحقوق محفوظة © 2024</p>
      </div>
    </div>
  );
});

export default InvoicePrint;