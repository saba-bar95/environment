import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, language, year) => {
  const isGeorgian = language === "ge";

  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for PDF download");
    return;
  }

  // Filter data for the specific year
  const filteredItem = data.find((item) => item.year === year.toString());
  if (!filteredItem) {
    console.warn(`No data found for year ${year}`);
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

  const nameHeader = isGeorgian ? "დასახელება" : "Name";
  const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";

  // Get dynamic headers from the filtered data item (excluding 'year')
  const regions = Object.keys(filteredItem).filter((key) => key !== "year");

  // Create table head
  const tableHead = [[nameHeader, valueHeader]];

  // Create table body
  const tableBody = regions.map((region) => {
    const row = [region];
    row.push(Number(filteredItem[region]));
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
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: "right" },
    },
  });

  // Generate filename
  const finalFilename = `${filename} (${year}).pdf`;

  // Save the PDF
  doc.save(finalFilename);
};

export default downloadPDF;
