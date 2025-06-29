import Papa from 'papaparse';
import { TableRow, TableColumn, CSVImportError, ImportResult } from '../types';

export const validateRowData = (
  data: any,
  columns: TableColumn[],
  rowIndex: number
): CSVImportError[] => {
  const errors: CSVImportError[] = [];

  columns.forEach(column => {
    const value = data[column.id];

    // Check required fields
    if (column.required && (!value || value.toString().trim() === '')) {
      errors.push({
        row: rowIndex,
        field: column.id,
        value,
        message: `${column.label} is required`
      });
      return;
    }

    // Skip validation for empty optional fields
    if (!value || value.toString().trim() === '') return;

    // Type validation
    switch (column.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors.push({
            row: rowIndex,
            field: column.id,
            value,
            message: `${column.label} must be a valid number`
          });
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.toString())) {
          errors.push({
            row: rowIndex,
            field: column.id,
            value,
            message: `${column.label} must be a valid email address`
          });
        }
        break;
    }
  });

  return errors;
};

export const parseCSV = (file: File, columns: TableColumn[]): Promise<ImportResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: CSVImportError[] = [];
        const validRows: TableRow[] = [];

        results.data.forEach((row: any, index: number) => {
          const rowErrors = validateRowData(row, columns, index + 1);
          
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            // Clean and convert the data
            const cleanRow: TableRow = {
              id: `imported_${Date.now()}_${index}`,
              name: row.name?.toString().trim() || '',
              email: row.email?.toString().trim() || '',
              age: row.age ? Number(row.age) : 0,
              role: row.role?.toString().trim() || '',
              department: row.department?.toString().trim() || '',
              location: row.location?.toString().trim() || ''
            };

            // Add any additional columns that exist in the CSV
            Object.keys(row).forEach(key => {
              if (!['id', 'name', 'email', 'age', 'role', 'department', 'location'].includes(key)) {
                cleanRow[key] = row[key];
              }
            });

            validRows.push(cleanRow);
          }
        });

        resolve({
          success: errors.length === 0,
          data: validRows,
          errors: errors.length > 0 ? errors : undefined
        });
      },
      error: (error) => {
        resolve({
          success: false,
          errors: [{
            row: 0,
            field: '',
            value: '',
            message: `CSV parsing failed: ${error.message}`
          }]
        });
      }
    });
  });
};

export const exportToCSV = (data: TableRow[], columns: TableColumn[], filename: string = 'export.csv') => {
  const visibleColumns = columns.filter(col => col.visible);
  
  const csvData = data.map(row => {
    const csvRow: any = {};
    visibleColumns.forEach(col => {
      csvRow[col.label] = row[col.id] || '';
    });
    return csvRow;
  });

  const csv = Papa.unparse(csvData);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
