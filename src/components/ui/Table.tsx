// src/components/ui/Table.tsx

import React from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = "No data available",
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${
                onRowClick
                  ? "hover:bg-gray-50 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;