import * as XLSX from "xlsx";

const downloadExcel = (data, filename, year, language) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  const yearHeader = isGeorgian ? "წელი" : "Year";
  const monthHeader = isGeorgian ? "თვე" : "Month";
  const headers = Object.keys(data[0]).filter((key) => key !== "month");

  const worksheetData = data.map((item) => {
    const row = { [monthHeader]: item.month };
    headers.forEach((header) => {
      row[header] = item[header];
    });
    return row;
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [monthHeader, ...headers], // Ensure month is the first column
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate filename, include year if desired
  const finalFilename = `${filename} ${year} ${yearHeader}.xlsx`;

  // Generate and download the Excel file
  XLSX.writeFile(workbook, finalFilename);
};

export default downloadExcel;
