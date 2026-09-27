
/**
 * Standard Pagination component
 * @param {Object} props
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {function} props.onPageChange - (page) => void
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Table pagination" className="d-flex justify-content-end mt-3">
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </button>
        </li>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;