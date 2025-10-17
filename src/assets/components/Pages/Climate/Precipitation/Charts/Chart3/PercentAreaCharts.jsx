import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const PercentAreaCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [downloadData, setDownloadData] = useState([]); // Flat format for Excel/PDF
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true); // Set loading to true when starting fetch
      setError(null); // Reset error state

      try {
        // Fetch data only
        const dataResult = await commonData(
          chartInfo.id,
          chartInfo.types[0],
          language
        );

        const rawData = dataResult.data.data || [];

        // chartInfo.selectedIndices should be [maxIndex, minIndex] e.g., [3, 4]
        const maxIndex = chartInfo.selectedIndices[0]; // Index 3 - MAX_MONTHLY
        const minIndex = chartInfo.selectedIndices[1]; // Index 4 - MIN_MONTHLY

        // Create ApexCharts range area format: array of {x: year, y: [min, max]}
        const rangeData = rawData.map((item) => {
          const minValue = parseFloat(item[String(minIndex)]) || 0;
          const maxValue = parseFloat(item[String(maxIndex)]) || 0;

          return {
            x: item.year,
            y: [minValue, maxValue],
          };
        });

        // ApexCharts format: series with single object containing data array
        const apexData = [
          {
            name:
              language === "ge"
                ? "თვიური ნალექის დიაპაზონი (მმ)"
                : "Monthly Precipitation Range (mm)",
            data: rangeData,
          },
        ];

        setChartData(apexData);

        // Create flat format for Download component (Excel/PDF)
        const flatData = rawData.map((item) => {
          const minValue = parseFloat(item[String(minIndex)]) || 0;
          const maxValue = parseFloat(item[String(maxIndex)]) || 0;

          return {
            year: item.year,
            [language === "ge" ? "მინიმალური" : "Minimum"]: minValue,
            [language === "ge" ? "მაქსიმალური" : "Maximum"]: maxValue,
          };
        });

        setDownloadData(flatData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
        setChartData([]);
        setDownloadData([]);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    getData();
  }, [language, chartInfo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <div className="download-placeholder">
              <span className="loading-spinner"></span>
              <span>{language === "ge" ? "ჩატვირთვა..." : "Loading..."}</span>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>
              {language === "ge"
                ? "მონაცემების ჩატვირთვა..."
                : "Loading data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}>
              {language === "ge" ? "ხელახლა ცდა" : "Retry"}
            </button>
          </div>
        </div>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}>
              {language === "ge" ? "ხელახლა ჩატვირთვა" : "Reload Chart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: "rangeArea",
      toolbar: {
        show: false,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors: ["#8b5cf6"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0.6,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    xaxis: {
      type: "numeric",
      title: {
        text: language === "ge" ? "წელი" : "Year",
        style: {
          fontSize: "11px",
          fontWeight: 900,
          color: "#373d3f",
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
    },
    yaxis: {
      title: {
        text: language === "ge" ? "ნალექები (მმ)" : "Precipitation (mm)",
        style: {
          fontSize: "11px",
          fontWeight: 900,
          color: "#373d3f",
        },
      },
      labels: {
        style: {
          fontSize: "11px",
          colors: "#373d3f",
        },
        formatter: function (value) {
          return value.toFixed(2);
        },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const year = data.x;
        const minValue = data.y[0];
        const maxValue = data.y[1];
        const unit = language === "ge" ? "მმ" : "mm";

        return `
          <div class="custom-tooltip">
            <div class="tooltip-container">
              <p class="tooltip-label">${year}</p>
              <p class="text">
                <span class="before-span" style="background-color: #8b5cf6; width: 12px; height: 12px; display: inline-block; margin-right: 8px;"></span>
                ${language === "ge" ? "მინიმალური" : "Minimum"}: 
                <span style="font-weight: 900; margin-left: 5px;">${minValue.toFixed(
                  2
                )} ${unit}</span>
              </p>
              <p class="text">
                <span class="before-span" style="background-color: #8b5cf6; width: 12px; height: 12px; display: inline-block; margin-right: 8px;"></span>
                ${language === "ge" ? "მაქსიმალური" : "Maximum"}: 
                <span style="font-weight: 900; margin-left: 5px;">${maxValue.toFixed(
                  2
                )} ${unit}</span>
              </p>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
  };

  // Show empty state if no data
  if (!chartData || chartData.length === 0 || !chartData[0]?.data?.length) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <div className="download-placeholder">
              {language === "ge"
                ? "მონაცემები არ მოიძებნა"
                : "No data to download"}
            </div>
          </div>
        </div>
        <div className="empty-state">
          <p>
            {language === "ge" ? "მონაცემები არ მოიძებნა" : "No data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1>
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
            <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={downloadData}
            filename={chartInfo[`title_${language}`]}
          />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="rangeArea"
          height={460}
        />
      </div>
    </div>
  );
};

export default PercentAreaCharts;
