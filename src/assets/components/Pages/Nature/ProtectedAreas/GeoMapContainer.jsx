import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./mapContainer.css";
import * as XLSX from "xlsx";

const GeoMapContainer = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const protectedAreasLayerRef = useRef(null);
  const legendRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [totalCount, setTotalCount] = useState(0);
  const [allFeaturesData, setAllFeaturesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const categoryColors = useMemo(
    () => ({
      "ბუნების ძეგლი": "#14532D",
      აღკვეთილი: "#EA580C",
      "ეროვნული პარკი": "#16A34A",
      "სახელმწიფო ნაკრძალი": "#1E40AF",
      "დაცული ლანდშაფტი": "#84CC16",
      "მრავალმხრივი გამოყენების ტერიტორია": "#EAB308",
    }),
    []
  );

  const renderLegendContent = useCallback(
    (
      isLoading,
      error,
      categories,
      activeCategories,
      totalCount,
      categoryColors
    ) => {
      let innerHTML = `<h4>📊 დაცული ტერიტორიების კატეგორიები</h4><div id="legend-content">`;
      if (isLoading) {
        innerHTML += `
          <div style="text-align: center;">
            <div class="loading-spinner"></div>
            <div style="margin-top: 5px; font-size: 12px;">იტვირთება...</div>
          </div>
        `;
      } else if (error) {
        innerHTML += `
          <div style="text-align: center; color: #dc3545;">
            ⚠️ ${error}
          </div>
        `;
      } else {
        innerHTML += categories
          .map(
            ([category, count]) => `
              <div class="legend-item ${
                activeCategories.has(category) ? "" : "disabled"
              }" data-category="${category}" onclick="window.toggleCategory('${category}')">
                <div class="legend-label">
                  <span class="visibility-toggle">${
                    activeCategories.has(category) ? "👁️" : "👁️‍🗨️"
                  }</span>
                  <span class="legend-color-box" style="background-color: ${
                    categoryColors[category] || "#6B7280"
                  };"></span>
                  ${category}
                </div>
                <span class="legend-count">${count}</span>
              </div>
            `
          )
          .join("");
        innerHTML += `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
            <b>სულ: <span style="color: #667eea;">${totalCount}</span></b>
          </div>
          <button class="reset-filters-btn" onclick="document.getElementById('reset-btn').click()">ყველას ჩვენება</button>
        `;
      }
      innerHTML += `</div>`;
      return innerHTML;
    },
    []
  );

  const toggleCategory = useCallback((category) => {
    setActiveCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const updateCQLFilter = useCallback(() => {
    if (!mapInstanceRef.current || !protectedAreasLayerRef.current) {
      return;
    }

    if (protectedAreasLayerRef.current) {
      mapInstanceRef.current.removeLayer(protectedAreasLayerRef.current);
    }

    let cqlFilter = "";
    if (activeCategories.size === 0) {
      cqlFilter = "1=0";
    } else if (activeCategories.size === activeCategories.length) {
      cqlFilter = undefined;
    } else {
      cqlFilter = Array.from(activeCategories)
        .map((cat) => `kategoria='${cat}'`)
        .join(" OR ");
    }

    protectedAreasLayerRef.current = L.tileLayer
      .wms("https://census-map.geostat.ge/geoserver/wms", {
        layers: "census:daculi",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        opacity: 0.9,
        tiled: true,
        CQL_FILTER: cqlFilter,
      })
      .addTo(mapInstanceRef.current);
  }, [activeCategories]);

  // Map initialization
  useEffect(() => {
    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([42.1, 43.5], 7.6);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
      opacity: 0.7,
    }).addTo(mapInstanceRef.current);

    // Add municipalities layer
    L.tileLayer
      .wms("https://census-map.geostat.ge/geoserver/wms", {
        layers: "census:municipalitetebi",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        opacity: 0.9,
        tiled: true,
        styles: "",
      })
      .addTo(mapInstanceRef.current);

    // Initialize protected areas layer
    protectedAreasLayerRef.current = L.tileLayer
      .wms("https://census-map.geostat.ge/geoserver/wms", {
        layers: "census:daculi",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        attribution: "GeoStat",
        opacity: 0.9,
        tiled: true,
        styles: "",
      })
      .addTo(mapInstanceRef.current);

    // Add scale control
    L.control
      .scale({ position: "bottomleft", imperial: false })
      .addTo(mapInstanceRef.current);

    // Add legend control
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      legendRef.current = div;
      div.innerHTML = renderLegendContent(
        isLoading,
        error,
        categories,
        activeCategories,
        totalCount,
        categoryColors
      );
      L.DomEvent.disableClickPropagation(div);
      return div;
    };
    legend.addTo(mapInstanceRef.current);

    // Set global toggleCategory for legend clicks
    window.toggleCategory = toggleCategory;

    // Initial update of CQL filter
    updateCQLFilter();

    // Map click handler
    mapInstanceRef.current.on("click", async (e) => {
      const point = mapInstanceRef.current.latLngToContainerPoint(e.latlng);
      const size = mapInstanceRef.current.getSize();
      const bounds = mapInstanceRef.current.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const params = {
        request: "GetFeatureInfo",
        service: "WMS",
        srs: "EPSG:4326",
        styles: "",
        transparent: true,
        version: "1.1.0",
        format: "image/png",
        bbox: `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`,
        height: size.y,
        width: size.x,
        layers: "census:daculi,census:municipalitetebi",
        query_layers: "census:daculi,census:municipalitetebi",
        info_format: "application/json",
        x: Math.round(point.x),
        y: Math.round(point.y),
      };

      const queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");

      try {
        const response = await fetch(
          `https://census-map.geostat.ge/geoserver/wms?${queryString}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const props = data.features[0].properties;
          let popupContent = "";

          if (props.kategoria) {
            const name = props.NameGEO || props.name || "უცნობი";
            const category = props.kategoria;
            const area = parseFloat(props.Area) || 0;
            const color = categoryColors[category] || "#6B7280";

            popupContent = `
            <div class="popup-header">
              📍 დაცული ტერიტორიის ინფორმაცია
            </div>
            <div style="padding: 10px;">
              <p style="margin: 8px 0;"><b>დასახელება:</b> ${name}</p>
              <p style="margin: 8px 0;">
                <b>კატეგორია:</b> 
                ${category} <span class="legend-color-box" style="background-color: ${color}; vertical-align: middle;"></span>
              </p>
              <p style="margin: 8px 0;"><b>ფართობი:</b> ${
                area > 1000000
                  ? (area / 1000000).toFixed(2) + " კმ²"
                  : area.toFixed(2) + " მ²"
              }</p>
            </div>
          `;
          } else {
            const name =
              props.MunicName || props.NAME_GEO || props.name || "უცნობი";
            popupContent = `
            <div class="popup-header">
              🏛️ მუნიციპალიტეტი
            </div>
            <div style="padding: 10px;">
              <p style="margin: 8px 0;"><b>დასახელება:</b> ${name}</p>
            </div>
          `;
          }

          L.popup()
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(mapInstanceRef.current);
        }
      } catch (error) {
        console.error("GetFeatureInfo Error:", error);
      }
    });

    return () => {
      mapInstanceRef.current.remove();
    };
  }, [
    categoryColors,
    toggleCategory,
    updateCQLFilter,
    categories,
    activeCategories,
    error,
    isLoading,
    renderLegendContent,
    totalCount,
  ]);

  useEffect(() => {
    fetch(
      "https://census-map.geostat.ge/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=census:daculi&outputFormat=application/json"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          setAllFeaturesData(data.features);
          const categoryCounts = {};
          data.features.forEach((feature) => {
            const category = feature.properties.kategoria || "სხვა";
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          const sortedCategories = Object.entries(categoryCounts).sort(
            (a, b) => b[1] - a[1]
          );
          setCategories(sortedCategories);
          setActiveCategories(new Set(sortedCategories.map(([cat]) => cat)));
          setTotalCount(
            sortedCategories.reduce((sum, [, count]) => sum + count, 0)
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("მონაცემების ჩატვირთვა ვერ მოხერხდა");
        setIsLoading(false);
      });
  }, []);

  const showAllCategories = useCallback(() => {
    setActiveCategories(new Set(categories.map(([cat]) => cat)));
  }, [categories]);

  //   Legend update
  useEffect(() => {
    if (legendRef.current) {
      legendRef.current.innerHTML = renderLegendContent(
        isLoading,
        error,
        categories,
        activeCategories,
        totalCount,
        categoryColors
      );
    }
  }, [
    isLoading,
    error,
    categories,
    activeCategories,
    totalCount,
    categoryColors,
    renderLegendContent,
  ]);

  const getFilteredFeatures = () => {
    if (!allFeaturesData) return [];
    if (activeCategories.size === 0) return [];
    if (activeCategories.size === categories.length) return allFeaturesData;
    return allFeaturesData.filter((feature) =>
      activeCategories.has(feature.properties.kategoria)
    );
  };

  const exportAsGeoJSON = () => {
    const features = getFilteredFeatures();
    if (features.length === 0) {
      alert("არ არის მონაცემები ექსპორტისთვის");
      return;
    }

    const geojson = { type: "FeatureCollection", features };
    const dataStr = JSON.stringify(geojson, null, 2);
    downloadFile(dataStr, "daculi_teritoriebi.geojson", "application/geo+json");
  };

  const exportAsExcel = () => {
    const features = getFilteredFeatures();
    if (features.length === 0) {
      alert("არ არის მონაცემები ექსპორტისთვის");
      return;
    }

    const data = features.map((feature) => ({
      დასახელება: feature.properties.NameGEO || feature.properties.name || "",
      კატეგორია: feature.properties.kategoria || "",
      "ფართობი (კმ²)": parseFloat(
        ((parseFloat(feature.properties.Area) || 0) / 1000000).toFixed(2)
      ),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "დაცული ტერიტორიები");
    XLSX.writeFile(wb, "daculi_teritoriebi.xlsx");
  };

  const exportAsKML = () => {
    const features = getFilteredFeatures();
    if (features.length === 0) {
      alert("არ არის მონაცემები ექსპორტისთვის");
      return;
    }

    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    kml += "  <Document>\n";
    kml += "    <name>დაცული ტერიტორიები</name>\n";

    Object.entries(categoryColors).forEach(([category, color]) => {
      const colorKML = color.substring(1);
      kml += `    <Style id="${category.replace(/\s/g, "_")}">\n`;
      kml += `      <PolyStyle>\n`;
      kml += `        <color>b3${colorKML}</color>\n`;
      kml += `        <outline>1</outline>\n`;
      kml += `      </PolyStyle>\n`;
      kml += `    </Style>\n`;
    });

    features.forEach((feature) => {
      const props = feature.properties;
      const name = props.NameGEO || props.name || "უსახელო";
      const category = props.kategoria || "";
      const styleId = category.replace(/\s/g, "_");

      kml += "    <Placemark>\n";
      kml += `      <name>${name}</name>\n`;
      kml += `      <description>კატეგორია: ${category}</description>\n`;
      kml += `      <styleUrl>#${styleId}</styleUrl>\n`;

      if (feature.geometry?.type === "Polygon") {
        kml += "      <Polygon>\n";
        kml += "        <outerBoundaryIs>\n";
        kml += "          <LinearRing>\n";
        kml += "            <coordinates>\n";
        feature.geometry.coordinates[0].forEach((coord) => {
          kml += `              ${coord[0]},${coord[1]},0\n`;
        });
        kml += "            </coordinates>\n";
        kml += "          </LinearRing>\n";
        kml += "        </outerBoundaryIs>\n";
        kml += "      </Polygon>\n";
      } else if (feature.geometry?.type === "MultiPolygon") {
        feature.geometry.coordinates.forEach((polygon) => {
          kml += "      <Polygon>\n";
          kml += "        <outerBoundaryIs>\n";
          kml += "          <LinearRing>\n";
          kml += "            <coordinates>\n";
          polygon[0].forEach((coord) => {
            kml += `              ${coord[0]},${coord[1]},0\n`;
          });
          kml += "            </coordinates>\n";
          kml += "          </LinearRing>\n";
          kml += "        </outerBoundaryIs>\n";
          kml += "      </Polygon>\n";
        });
      }
      kml += "    </Placemark>\n";
    });

    kml += "  </Document>\n";
    kml += "</kml>";

    downloadFile(
      kml,
      "daculi_teritoriebi.kml",
      "application/vnd.google-earth.kml+xml"
    );
  };

  const exportAsPDF = async () => {
    setExporting(true);
    try {
      const mapContainer = mapRef.current;
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: "#f8f9fa",
        width: mapContainer.offsetWidth,
        height: mapContainer.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const pdfCanvas = document.createElement("canvas");
      const pdfCtx = pdfCanvas.getContext("2d");
      const a4Width = 2970;
      const a4Height = 2100;

      pdfCanvas.width = a4Width;
      pdfCanvas.height = a4Height;

      pdfCtx.fillStyle = "#ffffff";
      pdfCtx.fillRect(0, 0, a4Width, a4Height);

      pdfCtx.font =
        'bold 60px Arial, "Noto Sans Georgian", "DejaVu Sans", sans-serif';
      pdfCtx.fillStyle = "#1f2937";
      pdfCtx.textAlign = "center";
      pdfCtx.fillText("საქართველოს დაცული ტერიტორიების რუკა", a4Width / 2, 120);

      const img = new Image();
      img.onload = () => {
        const maxWidth = a4Width - 300;
        const maxHeight = a4Height - 600;
        const imgRatio = img.height / img.width;
        let imgWidth = maxWidth;
        let imgHeight = maxWidth * imgRatio;

        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = maxHeight / imgRatio;
        }

        const imgX = (a4Width - imgWidth) / 2;
        const imgY = 180;
        pdfCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

        const infoY = imgY + imgHeight + 60;
        pdfCtx.font =
          '32px Arial, "Noto Sans Georgian", "DejaVu Sans", sans-serif';
        pdfCtx.fillStyle = "#374151";
        pdfCtx.textAlign = "left";
        const today = new Date();
        const dateStr = today.toLocaleDateString("ka-GE");
        pdfCtx.fillText(`შექმნის თარიღი: ${dateStr}`, 150, infoY);

        pdfCtx.textAlign = "right";
        pdfCtx.fillText(
          `სულ ტერიტორიები: ${getFilteredFeatures().length}`,
          a4Width - 150,
          infoY
        );

        pdfCtx.font =
          '24px Arial, "Noto Sans Georgian", "DejaVu Sans", sans-serif';
        pdfCtx.fillStyle = "#6b7280";
        pdfCtx.textAlign = "center";
        pdfCtx.fillText(
          "წყარო: საქართველოს სტატისტიკის ეროვნული სამსახური",
          a4Width / 2,
          a4Height - 60
        );

        const finalImgData = pdfCanvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });
        pdf.addImage(finalImgData, "JPEG", 0, 0, 297, 210);
        pdf.save(`დაცული_ტერიტორიები_${dateStr.replace(/\./g, "_")}.pdf`);
        setExporting(false);
      };
      img.src = imgData;
    } catch (error) {
      console.error("PDF export error:", error);
      alert("PDF-ის შექმნისას მოხდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
      setExporting(false);
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div
        className="map-container mt-4 mx-auto px-4"
        style={{
          width: "90%",
          padding: "20px",
          borderRadius: "15px",
        }}>
        <div className="map-header flex justify-between items-center mb-2">
          <div className="map-header-buttons space-x-2">
            <button
              className="export-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={exportAsGeoJSON}>
              ⬇️ GeoJSON
            </button>
            <button
              className="export-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={exportAsExcel}>
              ⬇️ Excel
            </button>
            <button
              className="export-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={exportAsKML}>
              ⬇️ KML
            </button>
            <button
              className="export-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={exportAsPDF}
              disabled={exporting}>
              📄 PDF
            </button>
          </div>
          <div className="layer-info text-sm text-gray-600">
            დააკლიკეთ კატეგორიას ფილტრაციისთვის
          </div>
        </div>
        <div ref={mapRef} className="w-full h-[600px] bg-gray-200"></div>
        <div
          className={`export-progress flex items-center space-x-2 mt-2 ${
            exporting ? "block" : "hidden"
          }`}>
          <div className="loading-spinner border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
          <div>PDF იქმნება...</div>
        </div>
        <button
          id="reset-btn"
          className="hidden"
          onClick={showAllCategories}></button>
      </div>
    </div>
  );
};

export default GeoMapContainer;
