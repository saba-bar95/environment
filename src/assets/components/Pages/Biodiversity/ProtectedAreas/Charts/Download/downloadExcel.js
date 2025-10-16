import * as XLSX from "xlsx";

const downloadExcel = (
  data,
  filename,
  unit,
  isPieChart,
  bcwy,
  language,
  year,
  sbcwp,
  isVertical
) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  const yearHeader = isGeorgian ? "წელი" : "Year";
  const nameHeader = isGeorgian ? "დასახელება" : "Name";
  const unitHeader = unit || " "; // Use unit parameter as header

  if (isVertical) {
    // Create headers based on language
    const nameHeader = isGeorgian ? "დასახელება" : "Name";
    const unitHeader = unit || (isGeorgian ? "რაოდენობა" : "Value");

    // Transform data into vertical format
    const worksheetData = data.map((item) => ({
      [nameHeader]: item.name,
      [unitHeader]: item.value,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: [nameHeader, unitHeader],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VerticalData");

    // Generate filename
    const finalFilename = `${filename}.xlsx`;

    // Generate and download the Excel file
    XLSX.writeFile(workbook, finalFilename);
    return;
  }

  if (sbcwp) {
    // Get headers for values (exclude 'year' and percentage fields)
    const valueHeaders = Object.keys(data[0]).filter(
      (key) => key !== "year" && !key.endsWith("_percent")
    );

    // Create worksheet data with translated year header and dynamic headers
    const worksheetData = data.map((item) => {
      const row = { [yearHeader]: item.year };
      valueHeaders.forEach((header) => {
        const value = Number(item[header]).toFixed(2);
        const percentKey = `${header}_percent`;
        const percentValue = item[percentKey];
        const percentText =
          percentValue >= 1 ? `${Number(percentValue).toFixed(1)}%` : "";
        row[header] = `${value} (${percentText})`;
      });
      return row;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: [yearHeader, ...valueHeaders], // Ensure year is the first column
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StackedBarData");

    // Generate filename
    const finalFilename = `${filename}.xlsx`;

    // Generate and download the Excel file
    XLSX.writeFile(workbook, finalFilename);
    return;
  }

  if (bcwy) {
    // For BarChartsWithYears, data is an array with one object where keys are categories
    const worksheetData = Object.keys(data[0])
      .filter((key) => key !== "name") // Exclude 'name' (year)
      .map((category) => ({
        [yearHeader]: data[0].name, // Use the year from data[0].name
        [nameHeader]: category,
        [unitHeader]: data[0][category] || " ",
      }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: [yearHeader, nameHeader, unitHeader], // Ensure correct column order
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BarChartData");

    // Generate filename
    const finalFilename = `${filename}.xlsx`;

    // Generate and download the Excel file
    XLSX.writeFile(workbook, finalFilename);
    return;
  }

  if (isPieChart) {
    // Create worksheet data with translated headers
    const worksheetData = data.map((item) => ({
      [yearHeader]: year,
      [nameHeader]: item.name,
      [unitHeader]: item.value,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: [yearHeader, nameHeader, unitHeader], // Ensure correct column order
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PieChartData");

    // Generate filename
    const finalFilename = `${filename}.xlsx`;

    // Generate and download the Excel file
    XLSX.writeFile(workbook, finalFilename);
    return;
  }
  // Original logic for non-pie chart data
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
