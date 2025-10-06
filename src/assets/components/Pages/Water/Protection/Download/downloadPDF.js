// src/components/Download/downloadPDF.js

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const downloadPDF = (data, filename = "chart-data") => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Error: No valid data provided for PDF download.");
        return;
    }

    const doc = new jsPDF();

    // Dynamically create table headers from the keys of the first data object
    const tableHeaders = Object.keys(data[0]);

    // Create the table body by mapping the data array
    const tableBody = data.map((row) => Object.values(row));

    autoTable(doc, {
        head: [tableHeaders],
        body: tableBody,
        startY: 20,
        didDrawPage: (data) => {
            // Add a title to the document
            doc.text(filename, 14, 15);
        },
    });

    doc.save(`${filename}.pdf`);
};

export default downloadPDF;