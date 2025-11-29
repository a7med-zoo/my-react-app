/* eslint-disable import/no-anonymous-default-export */
class BackupService {
  exportData() {
    const data = {
      products: JSON.parse(localStorage.getItem('products')) || [],
      customers: JSON.parse(localStorage.getItem('customers')) || [],
      invoices: JSON.parse(localStorage.getItem('invoices')) || [],
      notifications: JSON.parse(localStorage.getItem('notifications')) || [],
      exportDate: new Date().toLocaleString('ar-EG'),
      version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `micromanage-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  }

  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // التحقق من صحة البيانات
          if (!this.validateData(data)) {
            reject('ملف النسخة الاحتياطية غير صالح');
            return;
          }

          // استيراد البيانات
          if (data.products) localStorage.setItem('products', JSON.stringify(data.products));
          if (data.customers) localStorage.setItem('customers', JSON.stringify(data.customers));
          if (data.invoices) localStorage.setItem('invoices', JSON.stringify(data.invoices));
          if (data.notifications) localStorage.setItem('notifications', JSON.stringify(data.notifications));

          resolve('تم استيراد البيانات بنجاح');
        } catch (error) {
          reject('خطأ في قراءة الملف');
        }
      };

      reader.onerror = () => reject('خطأ في قراءة الملف');
      reader.readAsText(file);
    });
  }

  validateData(data) {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      (data.products || data.customers || data.invoices)
    );
  }

  getBackupInfo() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    
    return {
      productsCount: products.length,
      customersCount: customers.length,
      invoicesCount: invoices.length,
      lastBackup: localStorage.getItem('lastBackupDate'),
      totalSize: this.calculateDataSize()
    };
  }

  calculateDataSize() {
    const data = {
      products: localStorage.getItem('products'),
      customers: localStorage.getItem('customers'),
      invoices: localStorage.getItem('invoices')
    };
    
    const size = new Blob([JSON.stringify(data)]).size;
    return this.formatFileSize(size);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // نسخ احتياطي تلقائي
  autoBackup() {
    const lastBackup = localStorage.getItem('lastAutoBackup');
    const now = new Date().getTime();
    
    // نسخ احتياطي كل 24 ساعة
    if (!lastBackup || (now - parseInt(lastBackup)) > 24 * 60 * 60 * 1000) {
      this.exportData();
      localStorage.setItem('lastAutoBackup', now.toString());
    }
  }
}

export default new BackupService();