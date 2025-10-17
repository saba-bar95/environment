import * as XLSX from "xlsx";

const downloadExcel = (data, filename, language) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  console.log(data);

  const metricHeader = isGeorgian ? "დასახელება" : "Name";

  // Get dynamic year headers from the first data item (excluding 'metric')
  const yearHeaders = Object.keys(data[0]).filter((key) => key !== "metric");

  // Create worksheet data with metric as first column and year columns
  const worksheetData = data.map((item) => {
    const row = { [metricHeader]: item.metric };
    yearHeaders.forEach((year) => {
      row[year] = item[year];
    });
    return row;
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [metricHeader, ...yearHeaders], // Ensure metric is the first column
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate filename
  const finalFilename = `${filename}.xlsx`;

  // Generate and download the Excel file
  XLSX.writeFile(workbook, finalFilename);
};

export default downloadExcel;
