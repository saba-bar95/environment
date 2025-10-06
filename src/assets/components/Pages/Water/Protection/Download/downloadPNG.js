// src/components/Download/downloadPNG.js

import html2canvas from "html2canvas";

const downloadPNG = (chartRef, filename = "chart") => {
    if (!chartRef.current) {
        console.error("Error: Reference to the chart is not valid.");
        return;
    }

    html2canvas(chartRef.current, {
        backgroundColor: "#ffffff", // Set a white background
        logging: true,
        useCORS: true,
    }).then((canvas) => {
        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = image;
        link.download = `${filename}.png`;
        link.click();
    });
};

export default downloadPNG;