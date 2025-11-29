// خدمة للتخزين المحلي
export const storageService = {
  // حفظ البيانات
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`تم حفظ ${key}:`, data);
      return true;
    } catch (error) {
      console.error(`خطأ في حفظ ${key}:`, error);
      return false;
    }
  },

  // جلب البيانات
  load: (key) => {
    try {
      const data = localStorage.getItem(key);
      const result = data ? JSON.parse(data) : [];
      console.log(`تم تحميل ${key}:`, result);
      return result;
    } catch (error) {
      console.error(`خطأ في تحميل ${key}:`, error);
      return [];
    }
  },

  // حذف البيانات
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`خطأ في حذف ${key}:`, error);
      return false;
    }
  },

  // تنظيف كل البيانات
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('خطأ في تنظيف التخزين:', error);
      return false;
    }
  }
};