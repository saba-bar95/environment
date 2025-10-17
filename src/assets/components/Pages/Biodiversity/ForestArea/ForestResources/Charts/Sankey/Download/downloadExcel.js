import * as XLSX from "xlsx";

const downloadExcel = (data, filename, language, year) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  // Filter data for the specific year
  const filteredItem = data.find((item) => item.year === year.toString());
  if (!filteredItem) {
    console.warn(`No data found for year ${year}`);
    return;
  }

  const nameHeader = isGeorgian ? "დასახელება" : "Name";
  const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";

  // Get dynamic headers from the filtered data item (excluding 'year')
  const regions = Object.keys(filteredItem).filter((key) => key !== "year");

  // Create worksheet data with Name and Value columns
  const worksheetData = regions.map((region) => ({
    [nameHeader]: region,
    [valueHeader]: filteredItem[region],
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [nameHeader, valueHeader],
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate filename
  const finalFilename = `${filename} (${year}).xlsx`;

  // Generate and download the Excel file
  XLSX.writeFile(workbook, finalFilename);
};

export default downloadExcel;
