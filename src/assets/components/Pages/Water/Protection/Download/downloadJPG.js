// src/components/Download/downloadJPG.js

import html2canvas from "html2canvas";

const downloadJPG = (chartRef, filename = "chart") => {
    if (!chartRef.current) {
        console.error("Error: Reference to the chart is not valid.");
        return;
    }

    html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        logging: true,
        useCORS: true,
    }).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg", 0.9); // Use jpeg and set quality
        const link = document.createElement("a");
        link.href = image;
        link.download = `${filename}.jpg`;
        link.click();
    });
};

export default downloadJPG;