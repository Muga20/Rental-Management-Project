import React from 'react';

interface PagingBTNProps {
  currentPage: number;
  totalUsers: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const PagingBTN: React.FC<PagingBTNProps> = ({ currentPage, totalUsers, perPage, onPageChange }) => {
  const totalPages = Math.ceil(totalUsers / perPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <li key={i}>
            <button
              onClick={() => handlePageChange(i)}
              className={`flex items-center justify-center text-sm py-2 px-4 leading-tight border ${currentPage === i ? 'text-primary-600 bg-primary-50 border-primary-300' : 'text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
              aria-current={currentPage === i ? 'page' : undefined}
            >
              {i}
            </button>
          </li>
        );
      }
    } else {
      if (currentPage > 1) {
        pageNumbers.push(
          <li key="first">
            <button
              onClick={() => handlePageChange(1)}
              className="flex items-center justify-center text-sm py-2 px-4 leading-tight border text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </button>
          </li>
        );
      }

      if (currentPage > 3) {
        pageNumbers.push(<li key="start-ellipsis" className="text-gray-500 dark:text-gray-400 py-2 px-4">...</li>);
      }

      if (currentPage > 2) {
        pageNumbers.push(
          <li key={currentPage - 1}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center justify-center text-sm py-2 px-4 leading-tight border text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {currentPage - 1}
            </button>
          </li>
        );
      }

      pageNumbers.push(
        <li key={currentPage}>
          <button
            onClick={() => handlePageChange(currentPage)}
            className="flex items-center justify-center text-sm py-2 px-4 leading-tight border text-primary-600 bg-primary-50 border-primary-300"
            aria-current="page"
          >
            {currentPage}
          </button>
        </li>
      );

      if (currentPage < totalPages - 1) {
        pageNumbers.push(
          <li key={currentPage + 1}>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center justify-center text-sm py-2 px-4 leading-tight border text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {currentPage + 1}
            </button>
          </li>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(<li key="end-ellipsis" className="text-gray-500 dark:text-gray-400 py-2 px-4">...</li>);
      }

      if (currentPage < totalPages) {
        pageNumbers.push(
          <li key="last">
            <button
              onClick={() => handlePageChange(totalPages)}
              className="flex items-center justify-center text-sm py-2 px-4 leading-tight border text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {totalPages}
            </button>
          </li>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span className="font-semibold text-gray-900 dark:text-white"> {currentPage * perPage - perPage + 1} - {Math.min(currentPage * perPage, totalUsers)} </span>
          of
          <span className="font-semibold text-gray-900 dark:text-white"> {totalUsers} </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center justify-center h-9 py-2 px-4 ml-0 text-gray-500 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          {renderPageNumbers()}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center justify-center h-9 py-2 px-4 leading-tight text-gray-500 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
      
    </div>
  );
};

export default PagingBTN;
