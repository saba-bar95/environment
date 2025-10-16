import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import georgianFont from "../../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, year, language) => {
  const isGeorgian = language === "ge";

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No valid data provided for PDF download");
    return;
  }

  const doc = new jsPDF();

  if (isGeorgian) {
    doc.addFont(georgianFont, "NotoSansGeorgian", "normal");
    doc.addFont(georgianFont, "NotoSansGeorgian", "bold");
    doc.setFont("NotoSansGeorgian");
  } else {
    doc.setFont("helvetica");
  }

  const yearHeader = isGeorgian ? "წელი" : "Year";

  // Create custom headers
  const tableHead = [
    [
      isGeorgian ? "დასახელება" : "Name",
      isGeorgian ? "სულ მოვლენა" : "Total Events",
      isGeorgian ? "სულ გარდაცვლილი" : "Total Casualties",
    ],
  ];

  // Create table body
  const tableBody = data.map((item) => [
    `${item.name}`,
    `${item.total}`,
    `${item.casualties} `,
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
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
    },
    margin: { top: 20 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 50 },
      2: { cellWidth: 50 },
    },
  });

  const finalFilename = `${filename} ${year} ${yearHeader}.pdf`;
  doc.save(finalFilename);
};

export default downloadPDF;
