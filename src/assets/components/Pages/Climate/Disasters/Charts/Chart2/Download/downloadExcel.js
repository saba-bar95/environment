import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const downloadExcel = async (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Get headers from the first data item
  const headers = Object.keys(data[0]);

  // Define columns with headers
  worksheet.columns = headers.map((header) => ({
    header: header,
    key: header,
    width: Math.max(header.length + 5, 15), // Auto-size based on header length
  }));

  // Add data rows
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" }, // Blue background
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 25;

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    row.height = 20;
    row.alignment = { vertical: "middle", horizontal: "left" };

    // Alternate row colors
    if (rowNumber % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" }, // Light gray
      };
    }

    // Add borders to data cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD0D0D0" } },
        left: { style: "thin", color: { argb: "FFD0D0D0" } },
        bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
        right: { style: "thin", color: { argb: "FFD0D0D0" } },
      };
    });
  });

  // Auto-fit columns based on content
  worksheet.columns.forEach((column) => {
    let maxLength = column.header.length;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = Math.min(maxLength + 3, 50); // Cap at 50
  });

  // Generate buffer and save
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${filename}.xlsx`);
};

export default downloadExcel;
