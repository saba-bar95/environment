import * as XLSX from "xlsx";

const downloadExcel = (data, filename, language, isChart1, isChart2) => {
  const isGeorgian = language === "ge";

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  if (isChart1) {
    const rowHeaders = isGeorgian
      ? [
          "სახელი",
          "სიგრძე",
          "მდებარეობა",
          "აუზის ფართობი",
          "ზღვის აუზი",
          "ძირითადი გამოყენება",
        ] // Georgian translations
      : ["Name", "Length", "Location", "Basin Area", "Sea Basin", "Main Use"]; //

    const worksheetData = data.map((item) => ({
      [rowHeaders[0]]: item.name,
      [rowHeaders[1]]: `${item.length} ${language === "en" ? "km" : "კმ"}`,
      [rowHeaders[2]]: item.location,
      [rowHeaders[3]]: item.basinArea,
      [rowHeaders[4]]: item.seaBasin,
      [rowHeaders[5]]: item.mainUse,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const finalFilename = isGeorgian ? `${filename}.xlsx` : `${filename}.xlsx`;

    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, `${finalFilename}`);
    return;
  }

  if (isChart2) {
    const rowHeaders = isGeorgian
      ? [
          "სახელი", // Name
          "მდებარეობა", // Location
          "ძირითადი გამოყენება", // Main Use
          "ფართობი", // Area
          "მოცულობა", // Volume
          "საშუალო სიღრმე", // Average Depth
          "მაქსიმალური სიღრმე", // Maximum Depth
        ]
      : [
          "Name",
          "Location",
          "Main Use",
          "Area",
          "Volume",
          "Average Depth",
          "Maximum Depth",
        ];

    const worksheetData = data.map((item) => ({
      [rowHeaders[0]]: item.name,
      [rowHeaders[1]]: item.location,
      [rowHeaders[2]]: item.mainUse,
      [rowHeaders[3]]: `${item.area} ${isGeorgian ? "კმ²" : "km²"}`,
      [rowHeaders[4]]: `${item.volume} ${isGeorgian ? "მლნ მ³" : "million m³"}`,
      [rowHeaders[5]]: `${item.avgDepth} ${isGeorgian ? "მ" : "m"}`,
      [rowHeaders[6]]: `${item.maxDepth} ${isGeorgian ? "მ" : "m"}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const finalFilename = isGeorgian ? `${filename}.xlsx` : `${filename}.xlsx`;

    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, finalFilename);
    return;
  }
};

export default downloadExcel;
