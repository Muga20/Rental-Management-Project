import React from 'react';

interface Column {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
}

interface TableRowProps {
  row: any;
  columns: Column[];
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,

}) => {

  return (
    <tr className="border-b dark:border-gray-700">
      {columns.map((column, index) => {
        const cell =
          typeof column.accessor === 'function'
            ? column.accessor(row)
            : row[column.accessor];

        return (
          <td key={index} className="px-4 py-3">
            {cell}
          </td>
        );
      })}
      <td className="px-4 py-3">
        {/* Render ActionButtons with passed action handlers */}

      </td>
    </tr>
  );
};

export default TableRow;
