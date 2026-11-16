import * as XLSX from 'xlsx';

// Shared Excel builder for the /api/export route.
// columns: [{ key, header }] — key = field in each row object
// rows: plain objects; values may be string | number | Date | null
// Dates become real Excel dates (cellDates) so they sort/filter in Excel,
// numbers stay numeric so they can be SUMmed.
export function buildExcelBuffer({ columns, rows, sheetName }) {
  const aoa = [columns.map((c) => c.header)];
  for (const row of rows) {
    aoa.push(
      columns.map((c) => {
        const v = row[c.key];
        return v === undefined || v === null ? '' : v;
      })
    );
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });
  // Readable column widths (min 14, max 42 chars).
  ws['!cols'] = columns.map((c) => ({
    wch: Math.min(Math.max(c.header.length + 6, 14), 42),
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', cellDates: true });
}
