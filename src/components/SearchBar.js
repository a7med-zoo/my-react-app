import React from 'react';

const SearchBar = ({ placeholder, onSearch, onFilter }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" onChange={(e) => onFilter(e.target.value)}>
              <option value="">جميع العناصر</option>
              <option value="recent">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="name">بالاسم</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary w-100">
              <i className="fas fa-filter me-2"></i>
              تصفية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;