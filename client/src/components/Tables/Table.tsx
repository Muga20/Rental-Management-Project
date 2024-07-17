import React from 'react';
import TableRow from './TableRow';

interface Column {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
}

interface TableProps {
  columns: Column[];
  data: any[];

}

const Table: React.FC<TableProps> = ({
  columns,
  data,

}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-4 py-3">{column.header}</th>
            ))}
            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              row={row}
              columns={columns}
          
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
