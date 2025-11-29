import React, { useState, useEffect } from 'react';
import backupService from '../services/backupService';

const Backup = () => {
  const [backupInfo, setBackupInfo] = useState({});
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    loadBackupInfo();
  }, []);

  const loadBackupInfo = () => {
    setBackupInfo(backupService.getBackupInfo());
  };

  const handleExport = () => {
    const success = backupService.exportData();
    if (success) {
      alert('تم تصدير البيانات بنجاح');
      loadBackupInfo();
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('الرجاء اختيار ملف JSON صالح');
      return;
    }

    if (!window.confirm('هل أنت متأكد من استيراد البيانات؟ سيتم استبدال البيانات الحالية.')) {
      return;
    }

    setImportStatus('جاري استيراد البيانات...');
    
    backupService.importData(file)
      .then(message => {
        setImportStatus(message);
        alert(message);
        loadBackupInfo();
        // إعادة تحميل الصفحة لتحديث البيانات
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(error => {
        setImportStatus('فشل الاستيراد');
        alert(error);
      });

    // reset input
    event.target.value = '';
  };

  return (
    <div>
      <h2 className="text-center mb-4">
        <i className="fas fa-database me-2 text-primary"></i>
        النسخ الاحتياطي والاستعادة
      </h2>

      {/* معلومات النسخ الاحتياطي */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-box fa-2x mb-2"></i>
              <h4>{backupInfo.productsCount || 0}</h4>
              <p className="mb-0">المنتجات</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{backupInfo.customersCount || 0}</h4>
              <p className="mb-0">العملاء</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice fa-2x mb-2"></i>
              <h4>{backupInfo.invoicesCount || 0}</h4>
              <p className="mb-0">الفواتير</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-hdd fa-2x mb-2"></i>
              <h4>{backupInfo.totalSize || '0 KB'}</h4>
              <p className="mb-0">حجم البيانات</p>
            </div>
          </div>
        </div>
      </div>

      {/* تصدير البيانات */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title text-success">
            <i className="fas fa-download me-2"></i>
            تصدير البيانات
          </h5>
          <p className="text-muted">
            قم بتحميل نسخة احتياطية من جميع بياناتك لحفظها خارجياً.
          </p>
          <button className="btn btn-success" onClick={handleExport}>
            <i className="fas fa-file-export me-2"></i>
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* استيراد البيانات */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title text-warning">
            <i className="fas fa-upload me-2"></i>
            استيراد البيانات
          </h5>
          <p className="text-muted">
            استرجع البيانات من نسخة احتياطية سابقة. سيتم استبدال البيانات الحالية.
          </p>
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            تنبيه: استيراد البيانات سيحذف جميع البيانات الحالية ويستبدلها بالبيانات الجديدة.
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept=".json"
              onChange={handleImport}
            />
          </div>
          {importStatus && (
            <div className={`alert ${importStatus.includes('نجاح') ? 'alert-success' : 'alert-danger'}`}>
              {importStatus}
            </div>
          )}
        </div>
      </div>

      {/* نصائح الأمان */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-info">
            <i className="fas fa-shield-alt me-2"></i>
            نصائح الأمان
          </h5>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-cloud-download-alt text-primary me-3 mt-1"></i>
                <div>
                  <h6>احفظ نسخاً متعددة</h6>
                  <p className="text-muted mb-0">احتفظ بنسخ احتياطية في أماكن مختلفة.</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-calendar-check text-success me-3 mt-1"></i>
                <div>
                  <h6>نسخ احتياطي منتظم</h6>
                  <p className="text-muted mb-0">قم بعمل نسخ احتياطية أسبوعياً.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-lock text-warning me-3 mt-1"></i>
                <div>
                  <h6>حماية الملفات</h6>
                  <p className="text-muted mb-0">احفظ ملفات النسخ في مكان آمن.</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-sync text-info me-3 mt-1"></i>
                <div>
                  <h6>تحديث البيانات</h6>
                  <p className="text-muted mb-0">تأكد من تحديث النسخ الاحتياطية بانتظام.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;