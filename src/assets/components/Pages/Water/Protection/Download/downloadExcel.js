// src/components/Download/downloadExcel.js

import * as XLSX from "xlsx";

const downloadExcel = (data, filename = "chart-data") => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Error: No valid data provided for Excel download.");
        return;
    }

    // Convert the array of objects into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate the file and trigger the download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export default downloadExcel;