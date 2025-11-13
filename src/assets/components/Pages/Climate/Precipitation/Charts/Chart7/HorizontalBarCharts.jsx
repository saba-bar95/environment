import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const HorizontalBarCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [downloadData, setDownloadData] = useState([]); // Flat format for Excel/PDF
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and process data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dataResult = await commonData(
          chartInfo.id,
          chartInfo.types[0],
          language
        );

        // Define the regions and their min/max monthly precipitation indices
        const regions = [
          {
            name: language === "ge" ? "საქართველო" : "Georgia",
            minIndex: 4, // GEO - MIN_MONTHLY
            maxIndex: 3, // GEO - MAX_MONTHLY
          },
          {
            name:
              language === "ge"
                ? "სამეგრელო-ზემო სვანეთი"
                : "Samegrelo-Zemo Svaneti",
            minIndex: 14, // SAMEGRELO - MIN_MONTHLY
            maxIndex: 13, // SAMEGRELO - MAX_MONTHLY
          },
          {
            name: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli",
            minIndex: 19, // KVEMO_KARTLI - MIN_MONTHLY
            maxIndex: 18, // KVEMO_KARTLI - MAX_MONTHLY
          },
          {
            name: language === "ge" ? "თბილისი" : "Tbilisi",
            minIndex: 9, // TBILISI - MIN_MONTHLY
            maxIndex: 8, // TBILISI - MAX_MONTHLY
          },
        ];

        const rawData = dataResult?.data?.data || [];

        // Get data for 2024
        const data2024 = rawData.find((item) => item.year === 2024);

        if (!data2024) {
          setChartData([]);
          setDownloadData([]);
          return;
        }

        // Create ApexCharts RangeBar format
        // Series should have one entry with data array containing {x: region, y: [min, max]}
        const rangeData = regions.map((region) => {
          const minValue = parseFloat(data2024[String(region.minIndex)]) || 0;
          const maxValue = parseFloat(data2024[String(region.maxIndex)]) || 0;

          return {
            x: region.name,
            y: [minValue, maxValue],
          };
        });

        // ApexCharts format: series with single object containing data array
        const apexData = [
          {
            name:
              language === "ge" ? "დიაპაზონი 2024 წლისთვის" : "Range for 2024",
            data: rangeData,
          },
        ];

        setChartData(apexData);

        // Create flat format for Download component (Excel/PDF)
        const flatData = regions.map((region) => {
          const minValue = parseFloat(data2024[String(region.minIndex)]) || 0;
          const maxValue = parseFloat(data2024[String(region.maxIndex)]) || 0;

          return {
            year: 2024, // Add year for Excel/PDF download
            [language === "ge" ? "რეგიონი" : "Region"]: region.name,
            [language === "ge" ? "მინიმალური" : "Minimum"]: minValue,
            [language === "ge" ? "მაქსიმალური" : "Maximum"]: maxValue,
          };
        });

        setDownloadData(flatData);
        // console.log("Download data set:", flatData); // Debug log
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
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
      type: "rangeBar",
      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: "70%",
      },
    },
    colors: ["#f59e0b"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 3,
    },
    xaxis: {
      type: "numeric",
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const regionName = data.x;
        const minValue = data.y[0];
        const maxValue = data.y[1];
        const unit = language === "ge" ? "მმ" : "mm";

        return `
          <div class="custom-tooltip">
            <div class="tooltip-container">
              <p class="tooltip-label">${regionName}</p>
              <p class="text">
                <span class="before-span" style="background-color: #f59e0b; width: 12px; height: 12px; display: inline-block; margin-right: 8px;"></span>
                ${language === "ge" ? "მინიმალური (2024)" : "Minimum (2024)"}: 
                <span style="font-weight: 900; margin-left: 5px;">${minValue.toFixed(
                  0
                )} ${unit}</span>
              </p>
              <p class="text">
                <span class="before-span" style="background-color: #f59e0b; width: 12px; height: 12px; display: inline-block; margin-right: 8px;"></span>
                ${language === "ge" ? "მაქსიმალური (2024)" : "Maximum (2024)"}: 
                <span style="font-weight: 900; margin-left: 5px;">${maxValue.toFixed(
                  0
                )} ${unit}</span>
              </p>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 12,
        height: 12,
      },
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
            unit={chartInfo[`unit_${language}`]}
          />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="rangeBar"
          height={460}
        />
      </div>
    </div>
  );
};

export default HorizontalBarCharts;
