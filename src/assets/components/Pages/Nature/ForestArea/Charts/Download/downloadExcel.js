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
    
    // Apply styling to the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Style header row (row 0)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
        fill: { fgColor: { rgb: "4472C4" } }, // Blue header background
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style data rows with alternating colors
    for (let row = 1; row <= range.e.r; row++) {
      const isEvenRow = row % 2 === 0;
      const fillColor = isEvenRow ? "F2F2F2" : "FFFFFF"; // Light gray alternating rows
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: { color: { rgb: "000000" }, size: 11 },
          fill: { fgColor: { rgb: fillColor } },
          alignment: { horizontal: col === 2 ? "right" : "left", vertical: "center" }, // Right align values
          border: {
            top: { style: "thin", color: { rgb: "D0D0D0" } },
            bottom: { style: "thin", color: { rgb: "D0D0D0" } },
            left: { style: "thin", color: { rgb: "D0D0D0" } },
            right: { style: "thin", color: { rgb: "D0D0D0" } }
          },
          numFmt: col === 2 ? "#,##0.00" : "@" // Format numbers with decimals and thousands separator
        };
      }
    }
    
    // Set column widths for better readability
    const maxWidths = worksheetData.reduce((acc, row) => {
      Object.keys(row).forEach((key, index) => {
        const cellValue = String(row[key] || '');
        acc[index] = Math.max(acc[index] || 15, cellValue.length + 4);
      });
      return acc;
    }, {});

    worksheet['!cols'] = Object.values(maxWidths).map(width => ({ width }));
    
    // Set row height for header
    worksheet['!rows'] = [{ hpt: 25 }]; // Header row height
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Regional Data");

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
    
    // Apply styling to the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Style header row (row 0)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
        fill: { fgColor: { rgb: "28A745" } }, // Green header background for chart data
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style data rows with alternating colors
    for (let row = 1; row <= range.e.r; row++) {
      const isEvenRow = row % 2 === 0;
      const fillColor = isEvenRow ? "E8F5E8" : "FFFFFF"; // Light green alternating rows
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: { color: { rgb: "000000" }, size: 11 },
          fill: { fgColor: { rgb: fillColor } },
          alignment: { horizontal: col > 0 ? "right" : "left", vertical: "center" }, // Right align numeric values
          border: {
            top: { style: "thin", color: { rgb: "C0C0C0" } },
            bottom: { style: "thin", color: { rgb: "C0C0C0" } },
            left: { style: "thin", color: { rgb: "C0C0C0" } },
            right: { style: "thin", color: { rgb: "C0C0C0" } }
          },
          numFmt: col > 0 ? "#,##0.00" : "@" // Format numbers with decimals and thousands separator
        };
      }
    }
    
    // Set column widths for better readability
    const maxWidths = worksheetData.reduce((acc, row) => {
      Object.keys(row).forEach((key, index) => {
        const cellValue = String(row[key] || '');
        acc[index] = Math.max(acc[index] || 12, cellValue.length + 3);
      });
      return acc;
    }, {});

    worksheet['!cols'] = Object.values(maxWidths).map(width => ({ width }));
    
    // Set row height for header
    worksheet['!rows'] = [{ hpt: 25 }]; // Header row height
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Forest Data");

    const finalFilename = isGeorgian
      ? `${filename} (${unit}) (${year} ${yearHeader}).xlsx`
      : `${filename} (${unit.toLowerCase()}) (${year} ${yearHeader.toLowerCase()}).xlsx`;

    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, `${finalFilename}`);
    return;
  }
};

export default downloadExcel;
