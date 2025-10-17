import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, language) => {
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

  const metricHeader = isGeorgian ? "დასახელება" : "Name";

  // Get dynamic year headers from the first data item (excluding 'metric')
  const yearHeaders = Object.keys(data[0]).filter((key) => key !== "metric");

  // Create table head
  const tableHead = [[metricHeader, ...yearHeaders]];

  // Create table body
  const tableBody = data.map((item) => {
    const row = [item.metric];
    yearHeaders.forEach((year) => {
      row.push(Number(item[year]).toFixed(1));
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
      0: { cellWidth: 80 }, // Wider for metric names
    },
  });

  // Generate filename
  const finalFilename = `${filename}.pdf`;

  // Save the PDF
  doc.save(finalFilename);
};

export default downloadPDF;
