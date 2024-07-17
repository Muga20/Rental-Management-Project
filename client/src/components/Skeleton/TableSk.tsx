import React from 'react';

const TableSkeleton: React.FC = () => {
  const rows = Array(10).fill(0); 

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            
            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index} className="border-b dark:border-gray-700 animate-pulse">
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
