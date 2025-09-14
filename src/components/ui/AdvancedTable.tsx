import React, { useState, useMemo, useEffect } from "react";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type AdvancedTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  searchable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  rowsPerPage?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = "No data available",
  searchable = false,
  paginated = false,
  rowsPerPage = 10,
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = paginated
    ? filteredData.slice(startIndex, startIndex + rowsPerPage)
    : filteredData;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const SkeletonRow = () => (
    <tr>
      {columns.map((_, idx) => (
        <td key={idx} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  if (loading) {
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
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🔍 Search Bar */}
      {searchable && (
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {/* 📊 Table */}
      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-spacing-2 border-gray-200 rounded-lg shadow table-fixed">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 "
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`${
                    onRowClick
                      ? "hover:bg-gray-100 cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 border border-gray-300  max-w-[80px] sm:max-w-[105px] overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                      <div className="truncate">
                        {col.render ? col.render(row) : String(row[col.key])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📄 Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-full border-gray-200 md:text-lg text-indigo-500  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              {'<'}
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1  rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-indigo-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={page} className="px-3 py-1">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-full text-indigo-500 border-gray-200 md:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
            {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedTable;
