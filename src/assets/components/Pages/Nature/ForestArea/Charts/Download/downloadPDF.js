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
  source
) => {
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
