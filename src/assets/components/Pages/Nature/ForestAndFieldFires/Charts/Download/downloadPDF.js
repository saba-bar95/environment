import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import georgianFont from "../../../../../../fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (
  data,
  year,
  unit,
  filename,
  language,
  isChart1,
  isChart2,
  isChart3,
  source,
  mapData,
  isMapData
) => {
  const isGeorgian = language === "ge";

  if (isMapData && mapData && Array.isArray(mapData) && mapData.length > 0) {
    // Handle map data PDF download
    const doc = new jsPDF();

    // Load Georgian font if needed
    if (isGeorgian) {
      doc.addFont(georgianFont, "NotoSansGeorgian", "normal");
      doc.addFont(georgianFont, "NotoSansGeorgian", "bold");
      doc.setFont("NotoSansGeorgian");
    }

    const yearHeader = isGeorgian ? "წელი" : "Year";
    const regionHeader = isGeorgian ? "რეგიონი" : "Region";
    const valueHeader = isGeorgian ? "მნიშვნელობა" : "Value";
    const substanceHeader = isGeorgian ? "ტიპი" : "Type";
    
    const tableHead = [[regionHeader, yearHeader, valueHeader, substanceHeader]];
    
    // Map the comprehensive data to table format
    const tableBody = mapData.map(item => [
      item.region,
      item.year,
      item.value,
      item.substance
    ]);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      styles: {
        font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
        fontStyle: "bold",
        fontSize: 8, // Smaller font to fit more data
      },
      headStyles: {
        fillColor: [66, 139, 202], // Blue header
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { top: 20 },
      pageBreak: 'auto',
    });

    const firstItem = mapData[0];
    const finalFilename = `${filename} - ${firstItem.substance} (${firstItem.unit}).pdf`;
    doc.save(finalFilename);
    return;
  }

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
    const yearHeader = !isGeorgian ? "Year" : "წელი";
    const regionHeader = isGeorgian ? "რეგიონი" : "Region";
    const rowHeaders = isGeorgian
      ? ["წარმოქმნილი", "დაჭერილი", "გაფრქვეული"]
      : ["Generated", "Captured", "Emitted"];

    const tableHead = [
      [regionHeader, rowHeaders[1], rowHeaders[2], rowHeaders[0]],
    ];

    const tableBody = data.map((item) => [
      item.region,
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
      ? `${filename} (${unit}) (${year}toLowerCase() ${yearHeader}).pdf`
      : `${filename} (${unit.toLowerCase()}) (${year} ${yearHeader.toLowerCase()}).pdf`;

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
      ? `${filename} (${unit}) (${data[0].region}).pdf`
      : `${filename} (${unit.toLowerCase()}) (${data[0]}).pdf`;

    doc.save(finalFilename);

    return;
  }

  if (isChart3) {
    const yearHeader = !isGeorgian ? "Year" : "წელი";
    const rowHeaders = isGeorgian
      ? ["მობილური", "სტაციონარული"] // Georgian translations
      : ["Mobile", "Stationary"]; // English

    const tableHead = [[yearHeader, rowHeaders[0], rowHeaders[1]]];

    const tableBody = data.map((item) => [
      item.year,
      item.mobile,
      item.stationary,
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
      ? `${filename} (${source}).pdf`
      : `${filename} (${unit.toLowerCase()}) (${source.toLowerCase()}).pdf`;

    doc.save(finalFilename);
  }
};

export default downloadPDF;
