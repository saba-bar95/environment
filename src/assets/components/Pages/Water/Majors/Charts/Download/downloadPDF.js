import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import georgianFont from "../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, year, filename, language, isChart1, isChart2) => {
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
      : ["Name", "Length", "Location", "Basin Area", "Sea Basin", "Main Use"]; // English

    const tableHead = [
      [
        rowHeaders[0],
        rowHeaders[1],
        rowHeaders[2],
        rowHeaders[3],
        rowHeaders[4],
        rowHeaders[5],
      ],
    ];

    const tableBody = data.map((item) => [
      item.name,
      `${item.length} ${language === "en" ? "km" : "კმ"}`,
      item.location,
      item.basinArea,
      item.seaBasin,
      item.mainUse,
    ]);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      styles: {
        font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
        fontStyle: "bold",
      },
      margin: { top: 20 },
    });

    const finalFilename = isGeorgian ? `${filename}.pdf` : `${filename}.pdf`;

    doc.save(finalFilename);

    return;
  }

  if (isChart2) {
    const yearHeader = !isGeorgian ? "Year" : "წელი";
    const rowHeaders = isGeorgian
      ? ["წარმოქმნილი", "დაჭერილი", "გაფრქვეული"]
      : ["Generated", "Captured", "Emitted"];

    const tableHead = [
      [yearHeader, rowHeaders[1], rowHeaders[2], rowHeaders[0]],
    ];

    const tableBody = data.map((item) => [
      item.year,
      item.pollution_1,
      item.pollution_2,
      item.pollution_0,
    ]);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      styles: {
        font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
        fontStyle: "bold",
      },
      margin: { top: 20 },
    });

    const finalFilename = isGeorgian
      ? `${filename} ((${data[0].region}).pdf`
      : `${filename} ((${data[0]}).pdf`;

    doc.save(finalFilename);

    return;
  }
};

export default downloadPDF;
