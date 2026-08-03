"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/design-system/components/empty-state";
import { Pagination } from "@/design-system/components/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/design-system/components/table";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  pageSize?: number;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  pageSize = 10,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
