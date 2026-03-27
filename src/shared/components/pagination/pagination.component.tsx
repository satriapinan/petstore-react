import { Icon } from '@iconify/react';
import React, { useMemo } from 'react';
import './pagination.component.css';

interface PaginationProps {
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  const pageIndex = useMemo(() => Math.max(0, currentPage - 1), [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  const handlePage = (page: number) => {
    onPageChange?.(page);
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (currentPage > 4) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('...');

    pages.push(totalPages);

    return pages;
  }, [totalPages, currentPage]);

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <Icon icon="mdi:chevron-left" width={20} height={20} />
      </button>

      {pageNumbers.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx + 1}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`pagination__btn ${pageIndex === page - 1 ? 'pagination__btn--active' : ''}`}
            onClick={() => handlePage(page)}
            aria-label={`Page ${page}`}
            aria-current={pageIndex === page - 1 ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="pagination__btn"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <Icon icon="mdi:chevron-right" width={20} height={20} />
      </button>
    </nav>
  );
};

export default Pagination;
