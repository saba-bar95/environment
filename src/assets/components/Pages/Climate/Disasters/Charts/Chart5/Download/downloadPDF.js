import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, year, language) => {
  const isGeorgian = language === "ge";

  // Validate input data
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
  const monthHeader = isGeorgian ? "თვე" : "Month";

  // Get dynamic headers from the first data item (excluding 'month')
  const headers = Object.keys(data[0]).filter((key) => key !== "month");

  // Create table head
  const tableHead = [[monthHeader, ...headers]];

  // Create table body
  const tableBody = data.map((item) => {
    const row = [item.month];
    headers.forEach((header) => {
      row.push(Number(item[header]).toFixed(2));
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
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
    },
    margin: { top: 20 },
    columnStyles: {
      0: { cellWidth: 30 },
    },
  });

  // Generate filename
  const finalFilename = `${filename} ${year} ${yearHeader}.pdf`;

  // Save the PDF
  doc.save(finalFilename);
};

export default downloadPDF;
