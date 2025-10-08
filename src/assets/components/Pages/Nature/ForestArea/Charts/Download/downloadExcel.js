import * as XLSX from "xlsx";

const downloadExcel = (data, year, unit, filename, language, isChart1) => {
  const isGeorgian = language === "ge";

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
