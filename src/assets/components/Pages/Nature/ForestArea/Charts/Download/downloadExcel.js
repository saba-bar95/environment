import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const downloadExcel = async (data, year, unit, filename, language, isChart1, mapData, isMapData) => {
  const isGeorgian = language === "ge";

  if (isMapData && mapData && Array.isArray(mapData) && mapData.length > 0) {
    // Handle map data download - comprehensive regional data across all years
    const yearHeader = isGeorgian ? "წელი" : "Year";
    const regionHeader = isGeorgian ? "რეგიონი" : "Region";
    const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";
    const substanceHeader = isGeorgian ? "ტიპი" : "Type";
    
    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Regional Data');
    
    // Add headers
    const headers = [regionHeader, yearHeader, valueHeader, substanceHeader];
    worksheet.addRow(headers);
    
    // Add data rows
    mapData.forEach(item => {
      worksheet.addRow([item.region, item.year, item.value, item.substance]);
    });
    
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Blue background
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });
    
    // Style data rows with alternating colors
    for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      const isEvenRow = rowNum % 2 === 0;
      const fillColor = isEvenRow ? 'FFF2F2F2' : 'FFFFFFFF';
      
      row.eachCell((cell, colNumber) => {
        cell.font = { size: 11, color: { argb: 'FF000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
        cell.alignment = { 
          horizontal: colNumber === 3 ? 'right' : 'left', // Right align values column
          vertical: 'middle' 
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
        };
        
        // Format numbers with thousands separator and decimals
        if (colNumber === 3) {
          cell.numFmt = '#,##0.00';
        }
      });
    }
    
    // Auto-adjust column widths
    worksheet.columns.forEach((column, index) => {
      let maxLength = headers[index].length;
      worksheet.eachRow((row) => {
        const cell = row.getCell(index + 1);
        if (cell.value) {
          const cellLength = cell.value.toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      });
      column.width = Math.max(maxLength + 4, 15);
    });

    const firstItem = mapData[0];
    const finalFilename = `${filename} - ${firstItem.substance} (${firstItem.unit}).xlsx`;
    
    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), finalFilename);
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

    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Forest Data');
    
    // Add headers
    const headers = [regionHeader, rowHeaders[1], rowHeaders[2], rowHeaders[0]];
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(item => {
      worksheet.addRow([
        item.region,
        item.pollution_1,
        item.pollution_2,
        item.pollution_0
      ]);
    });
    
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF28A745' } // Green background for chart data
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });
    
    // Style data rows with alternating colors
    for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      const isEvenRow = rowNum % 2 === 0;
      const fillColor = isEvenRow ? 'FFE8F5E8' : 'FFFFFFFF'; // Light green alternating rows
      
      row.eachCell((cell, colNumber) => {
        cell.font = { size: 11, color: { argb: 'FF000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
        cell.alignment = { 
          horizontal: colNumber > 1 ? 'right' : 'left', // Right align numeric values
          vertical: 'middle' 
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFC0C0C0' } },
          left: { style: 'thin', color: { argb: 'FFC0C0C0' } },
          bottom: { style: 'thin', color: { argb: 'FFC0C0C0' } },
          right: { style: 'thin', color: { argb: 'FFC0C0C0' } }
        };
        
        // Format numbers with thousands separator and decimals
        if (colNumber > 1) {
          cell.numFmt = '#,##0.00';
        }
      });
    }
    
    // Auto-adjust column widths
    worksheet.columns.forEach((column, index) => {
      let maxLength = headers[index].length;
      worksheet.eachRow((row) => {
        const cell = row.getCell(index + 1);
        if (cell.value) {
          const cellLength = cell.value.toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      });
      column.width = Math.max(maxLength + 3, 12);
    });

    const finalFilename = isGeorgian
      ? `${filename} (${unit}) (${year} ${yearHeader}).xlsx`
      : `${filename} (${unit.toLowerCase()}) (${year} ${yearHeader.toLowerCase()}).xlsx`;

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), finalFilename);
    return;
  }
};

export default downloadExcel;
