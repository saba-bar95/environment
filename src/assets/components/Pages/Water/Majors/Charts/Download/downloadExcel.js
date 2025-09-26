import * as XLSX from "xlsx";

const downloadExcel = (data, year, filename, language, isChart1, isChart2) => {
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
    // const yearHeader = !isGeorgian ? "Year" : "წელი";
    // const rowHeaders = isGeorgian
    //   ? ["წარმოქმნილი", "დაჭერილი", "გაფრქვეული"] // Georgian translations
    //   : ["Generated", "Captured", "Emitted"]; // English
    // const worksheetData = data.map((item) => ({
    //   [yearHeader]: item.year,
    //   [rowHeaders[1]]: item.pollution_1,
    //   [rowHeaders[2]]: item.pollution_2,
    //   [rowHeaders[0]]: item.pollution_0,
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    // const finalFilename = isGeorgian
    //   ? `${filename} ((${data[0].region}).xlsx`
    //   : `${filename} ((${data[0]}).xlsx`;
    // // Generate the Excel file and trigger the download
    // XLSX.writeFile(workbook, `${finalFilename}`);
    // return;
  }
};

export default downloadExcel;
