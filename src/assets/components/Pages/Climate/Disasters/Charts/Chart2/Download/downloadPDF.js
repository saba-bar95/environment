import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, language) => {
  const isGeorgian = language === "ge";

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for PDF download");
    return;
  }

  const doc = new jsPDF();

  // Load Georgian font if needed
  if (isGeorgian) {
    doc.addFont(georgianFont, "NotoSansGeorgian", "normal");
    doc.addFont(georgianFont, "NotoSansGeorgian", "bold");
    doc.setFont("NotoSansGeorgian");
  } else {
    doc.setFont("helvetica");
  }

  const yearHeader = isGeorgian ? "წელი" : "Year";

  // Get dynamic headers from the first data item (excluding 'year')
  const headers = Object.keys(data[0]).filter((key) => key !== "year");

  // Create table head
  const tableHead = [[yearHeader, ...headers]];

  // Create table body
  const tableBody = data.map((item) => {
    const row = [item.year];
    headers.forEach((header) => {
      row.push(Number(item[header]).toFixed(2)); // Format numbers to 2 decimal places
    });
    return row;
  });

  // Add table to PDF
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    styles: {
      font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 2,
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [200, 200, 200], // Light gray background for header
      textColor: [0, 0, 0], // Black text
    },
    margin: { top: 20 },
    columnStyles: {
      0: { cellWidth: 30 }, // Set width for year column
    },
  });

  // Generate filename
  const finalFilename = isGeorgian ? `${filename}.pdf` : `${filename}.pdf`;

  // Save the PDF
  doc.save(finalFilename);
  return;
};

export default downloadPDF;
