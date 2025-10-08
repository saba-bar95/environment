import html2canvas from "html2canvas";

const downloadJPG = (e, filename = "Forest Fires Chart", language = "en") => {
  // Find the closest parent element with the class 'chart-wrapper'
  const chartElement = e.target.closest(".chart-wrapper");
  if (!chartElement) {
    console.warn("Chart element not found for JPG download");
    return;
  }

  // Hide the dropdown content and tooltips to avoid capturing them
  const dropdownContent = e.target
    .closest(".download-container")
    ?.querySelector(".dropdown-content");
  
  // Hide any visible tooltips
  const tooltips = chartElement.querySelectorAll('.custom-tooltip');
  const originalTooltipDisplays = [];
  
  tooltips.forEach((tooltip, index) => {
    originalTooltipDisplays[index] = tooltip.style.display;
    tooltip.style.display = 'none';
  });
  
  if (dropdownContent) {
    dropdownContent.style.display = "none";
  }

  // Wait a small amount of time for the dropdown to hide
  setTimeout(() => {
    // Configure html2canvas options for better quality
    const options = {
      useCORS: true,
      allowTaint: true,
      scale: 2, // Higher quality
      backgroundColor: "#ffffff", // White background
      logging: false,
      width: chartElement.offsetWidth,
      height: chartElement.offsetHeight,
      ignoreElements: (element) => {
        // Ignore dropdown elements, tooltips, and other UI components that shouldn't be captured
        return element.classList?.contains('dropdown-content') || 
               element.classList?.contains('custom-tooltip') ||
               element.id === 'custom-tooltip' ||
               element.style?.display === 'none' ||
               element.style?.pointerEvents === 'none' ||
               // Ignore amCharts tooltip elements
               element.classList?.contains('am5-tooltip-container') ||
               element.classList?.contains('am5-tooltip') ||
               // Ignore any loading spinners
               element.classList?.contains('loading-spinner') ||
               element.classList?.contains('spinner');
      }
    };

    html2canvas(chartElement, options)
      .then((canvas) => {
        // Create download link
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg", 0.95); // High quality JPEG
        
        // Generate proper filename
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9\s\-_]/g, ''); // Remove special characters
        link.download = `${sanitizedFilename} - ${timestamp}.jpg`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("JPG download completed successfully");
      })
      .catch((error) => {
        console.error("Error generating JPG:", error);
        
        // Fallback: show user-friendly error message
        const isGeorgian = language === "ge";
        const errorMessage = isGeorgian 
          ? "JPG ფაილის ჩამოტვირთვისას მოხდა შეცდომა" 
          : "Error downloading JPG file";
        alert(errorMessage);
      })
      .finally(() => {
        // Show the dropdown content and tooltips again
        if (dropdownContent) {
          dropdownContent.style.display = "block";
        }
        
        // Restore tooltip visibility
        tooltips.forEach((tooltip, index) => {
          tooltip.style.display = originalTooltipDisplays[index] || '';
        });
      });
  }, 100); // Small delay to ensure dropdown is hidden
};

export default downloadJPG;