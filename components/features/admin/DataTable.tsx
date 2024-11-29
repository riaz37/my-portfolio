import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/ui/data-display/table';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Pencil,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { Card } from '@/components/shared/ui/core/card';


interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
  className?: string;
  priority?: number; // 1 = highest priority (always show), 2 = medium, 3 = lowest
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onSort?: (key: string) => void;
}

export function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  onSort 
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 10;

  // Filter data based on search
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get high priority columns for mobile view
  const highPriorityColumns = columns.filter(col => col.priority === 1);

  const renderMobileCard = (item: any, index: number) => (
    <Card key={index} className="mb-4 p-4">
      <div className="space-y-3">
        {columns.map((column) => (
          <div key={column.key} className="flex justify-between items-start gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {column.label}
            </span>
            <span className="text-sm text-right">
              {column.render
                ? column.render(item[column.key])
                : String(item[column.key])}
            </span>
          </div>
        ))}
        {(onEdit || onDelete) && (
          <div className="flex justify-end space-x-2 mt-3 pt-3 border-t">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  const renderDesktopTable = () => (
    <div className="rounded-md border overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={column.className}
                  >
                    <div className="flex items-center justify-between space-x-2">
                      <span>{column.label}</span>
                      {column.sortable && onSort && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSort(column.key)}
                          className="p-0 h-auto"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="w-[100px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key}
                        className={column.className}
                      >
                        {column.render
                          ? column.render(item[column.key])
                          : String(item[column.key])}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="w-[100px]">
                        <div className="flex items-center justify-end space-x-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <div className="text-sm text-muted-foreground">
          {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'} total
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {paginatedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No results found
          </div>
        ) : (
          paginatedData.map((item, index) => renderMobileCard(item, index))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="hidden sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
