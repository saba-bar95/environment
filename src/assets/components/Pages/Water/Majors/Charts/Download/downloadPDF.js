import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import georgianFont from "../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (data, filename, language, isChart1, isChart2) => {
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
    const rowHeaders = isGeorgian
      ? [
          "სახელი", // Name
          "მდებარეობა", // Location
          "ძირითადი გამოყენება", // Main Use
          "ფართობი", // Area
          "მოცულობა", // Volume
          "საშუალო სიღრმე", // Average Depth
          "მაქსიმალური სიღრმე", // Maximum Depth
        ]
      : [
          "Name",
          "Location",
          "Main Use",
          "Area",
          "Volume",
          "Average Depth",
          "Maximum Depth",
        ];

    const tableHead = [
      [
        rowHeaders[0],
        rowHeaders[1],
        rowHeaders[2],
        rowHeaders[3],
        rowHeaders[4],
        rowHeaders[5],
        rowHeaders[6],
      ],
    ];

    const tableBody = data.map((item) => [
      item.name,
      item.location,
      item.mainUse,
      `${item.area} ${isGeorgian ? "კმ²" : "km²"}`,
      `${item.volume} ${isGeorgian ? "მლნ მ³" : "million m³"}`,
      `${item.avgDepth} ${isGeorgian ? "მ" : "m"}`,
      `${item.maxDepth} ${isGeorgian ? "მ" : "m"}`,
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
};

export default downloadPDF;
