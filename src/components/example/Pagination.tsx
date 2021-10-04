import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Pagination: React.FC<{
  page?: number;
  lastPage: number;
  fetchNextPage: () => void;
  fetchPrevPage: () => void;
}> = ({ page = 1, lastPage, fetchNextPage, fetchPrevPage }) => {
  return (
    <div className="pagination">
      {page === 1 ? (
        <div className="disabled-btn">
          <LeftOutlined />
        </div>
      ) : (
        <a role="button" onClick={fetchPrevPage}>
          <LeftOutlined />
        </a>
      )}
      <div className="page">
        <b>{page}</b> page
      </div>
      {page >= lastPage ? (
        <div className="disabled-btn">
          <RightOutlined />
        </div>
      ) : (
        <a role="button" onClick={fetchNextPage}>
          <RightOutlined />
        </a>
      )}
    </div>
  );
};

export default Pagination;
