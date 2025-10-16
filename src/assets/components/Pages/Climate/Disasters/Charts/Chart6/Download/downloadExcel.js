import * as XLSX from "xlsx";

const downloadExcel = (data, filename, year, language) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for Excel download");
    return;
  }

  const yearHeader = isGeorgian ? "წელი" : "Year";
  const nameHeader = isGeorgian ? "დასახელება" : "Name";
  const totalHeader = isGeorgian ? "სულ მოვლენა" : "Total Events";
  const casualtiesHeader = isGeorgian ? "სულ გარდაცვლილი" : "Total Casualties";

  // Prepare worksheet data
  const worksheetData = data.map((item) => ({
    [nameHeader]: item.name,
    [totalHeader]: item.total,
    [casualtiesHeader]: item.casualties,
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate filename
  const finalFilename = `${filename} ${year} ${yearHeader}.xlsx`;

  // Save Excel file
  XLSX.writeFile(workbook, finalFilename);
};

export default downloadExcel;
