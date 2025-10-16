import * as XLSX from "xlsx";

const downloadExcel = (data, filename, language) => {
  console.log(data);
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  const nameHeader = isGeorgian ? "დასახელება" : "Name";

  // Check if this is pie chart data (has 'name' and 'value' properties)
  if (data[0].name && data[0].value) {
    // Pie chart logic
    const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";

    // Create worksheet data with name and value columns
    const worksheetData = data.map((item) => ({
      [nameHeader]: item.name,
      [valueHeader]: item.value,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: [nameHeader, valueHeader],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate filename
    const finalFilename = `${filename}.xlsx`;

    // Generate and download the Excel file
    XLSX.writeFile(workbook, finalFilename);
    return;
  }

  // Original logic for non-pie chart data (year-based)
  const yearHeader = isGeorgian ? "წელი" : "Year";

  // Get dynamic headers from the first data item (excluding 'year')
  const headers = Object.keys(data[0]).filter((key) => key !== "year");

  // Create worksheet data with translated year header and dynamic headers
  const worksheetData = data.map((item) => {
    const row = { [yearHeader]: item.year };
    headers.forEach((header) => {
      row[header] = item[header];
    });
    return row;
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [yearHeader, ...headers], // Ensure year is the first column
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate filename
  const finalFilename = `${filename}.xlsx`;

  // Generate and download the Excel file
  XLSX.writeFile(workbook, finalFilename);
};

export default downloadExcel;
