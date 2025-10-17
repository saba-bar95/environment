import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (
  data,
  filename,
  unit,
  isPieChart,
  bcwy,
  language,
  year
) => {
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
  const nameHeader = isGeorgian ? "დასახელება" : "Name";
  const unitHeader = unit; // Use unit parameter as header

  if (bcwy) {
    // Create table head
    const tableHead = [[yearHeader, nameHeader, unitHeader]];

    // Create table body
    const tableBody = Object.keys(data[0])
      .filter((key) => key !== "name") // Exclude 'name' (year)
      .map((category) => [
        data[0].name, // Use the year from data[0].name
        category,
        Number(data[0][category]).toFixed(2), // Format numbers to 2 decimal places
      ]);

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
        1: { cellWidth: 80 }, // Wider width for name column to accommodate long text
      },
    });

    // Generate filename
    const finalFilename = `${filename}.pdf`;

    // Save the PDF
    doc.save(finalFilename);
    return;
  }

  if (isPieChart) {
    // Create table head
    const tableHead = [[yearHeader, nameHeader, unitHeader]];

    // Create table body
    const tableBody = data.map((item) => [
      year,
      item.name,
      Number(item.value).toFixed(2), // Format numbers to 2 decimal places
    ]);

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
        1: { cellWidth: 80 }, // Wider width for name column to accommodate long text
      },
    });

    // Generate filename
    const finalFilename = `${filename}.pdf`;

    // Save the PDF
    doc.save(finalFilename);
    return;
  }

  // Original logic for non-pie chart data
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
  const finalFilename = `${filename}.pdf`;

  // Save the PDF
  doc.save(finalFilename);
};

export default downloadPDF;
