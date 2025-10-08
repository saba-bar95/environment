import * as XLSX from "xlsx";

const downloadExcel = (data, year, unit, filename, language, isChart1, mapData, isMapData) => {
  const isGeorgian = language === "ge";

  if (isMapData && mapData && Array.isArray(mapData) && mapData.length > 0) {
    // Handle map data download - comprehensive regional data across all years
    const yearHeader = isGeorgian ? "წელი" : "Year";
    const regionHeader = isGeorgian ? "რეგიონი" : "Region";
    const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";
    const substanceHeader = isGeorgian ? "ტიპი" : "Type";
    
    // Map the comprehensive data to worksheet format
    const worksheetData = mapData.map(item => ({
      [regionHeader]: item.region,
      [yearHeader]: item.year,
      [valueHeader]: item.value,
      [substanceHeader]: item.substance
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Regional Data");

    // Set column widths for better readability
    const maxWidths = worksheetData.reduce((acc, row) => {
      Object.keys(row).forEach((key, index) => {
        const cellValue = String(row[key] || '');
        acc[index] = Math.max(acc[index] || 10, cellValue.length + 2);
      });
      return acc;
    }, {});

    worksheet['!cols'] = Object.values(maxWidths).map(width => ({ width }));

    const firstItem = mapData[0];
    const finalFilename = `${filename} - ${firstItem.substance} (${firstItem.unit}).xlsx`;
    XLSX.writeFile(workbook, finalFilename);
    return;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  if (isChart1) {
    const yearHeader = !isGeorgian ? "Year" : "წელი";
    const regionHeader = !isGeorgian ? "Region" : "რეგიონი";
    const rowHeaders = isGeorgian
      ? ["წარმოქმნილი", "დაჭერილი", "გაფრქვეული"] // Georgian translations
      : ["Generated", "Captured", "Emitted"]; // English

    const worksheetData = data.map((item) => ({
      [regionHeader]: item.region,
      [rowHeaders[1]]: item.pollution_1,
      [rowHeaders[2]]: item.pollution_2,
      [rowHeaders[0]]: item.pollution_0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const finalFilename = isGeorgian
      ? `${filename} (${unit}) (${year} ${yearHeader}).xlsx`
      : `${filename} (${unit.toLowerCase()}) (${year} ${yearHeader.toLowerCase()}).xlsx`;

    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, `${finalFilename}`);
    return;
  }
};

export default downloadExcel;
