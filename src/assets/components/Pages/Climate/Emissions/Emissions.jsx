import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import { useEffect } from "react";
// --- Import all chart components ---
import LineChart1 from "./Charts/Chart1/LineCharts.jsx";
import AreaCharts from "./Charts/Chart2/AreaCharts.jsx";
import PieCharts from "./Charts/Chart3/PieCharts.jsx";
import AreaCharts5 from "./Charts/Chart5/AreaCharts.jsx";
import LineCharts4 from "./Charts/Chart4/LineCharts4.jsx";
import BarCharts from "./Charts/Chart6/BarCharts.jsx";
import HorizontalBarCharts from "./Charts/Chart7/HorizontalBarCharts.jsx";
import ScatterCharts from "./Charts/Chart8/ScatterChart.jsx";
import ScatterChart9 from "./Charts/Chart9/ScatterChart.jsx";
import LineChart2 from "./Charts/Chart10/LineChart2.jsx";
// --- 1. IMPORT the new AreaCharts2 component from the chart11 folder ---
import AreaCharts2 from "./Charts/Chart11/AreaCharts2.jsx";
import LineCharts3 from "./Charts/Chart12/LineCharts3.jsx";

const Emissions = () => {
  const { language } = useParams();

  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const ChartInfo = [
    // Chart 1: Line Chart
    {
      title_ge: "სათბურის გაზების ემისიები ძირითადი აირების მიხედვით",
      title_en: "Greenhouse Gas Emissions by Major Gases",
      unit_ge: "მეგატონა",
      unit_en: "Megatonne",
      colors: ["#2ca02c", "#d62728", "#1f77b4"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 2],
      chartID: "ghg-emissions-by-gas",
    },
    // Chart 2: Area Chart
    {
      title_ge: "ჯამური და წმინდა ემისიები (LULUCF-ის ჩათვლით)",
      title_en: "Total vs. Net Emissions (including LULUCF)",
      unit_ge: "მეგატონა (CO2 ეკვივალენტი)",
      unit_en: "Megatonne (CO2 equivalent)",
      colors: ["#ff7f0e", "#55c079ff"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [6, 8],
      chartID: "ghg-total-vs-net-emissions",
    },
    // Chart 3: Pie Chart
    {
      title_ge: "ემისიები სექტორების მიხედვით",
      title_en: "Emissions by Sector",
      unit_ge: "მეგატონა",
      unit_en: "Megatonne",
      colors: ["#ff7f0e", "#9467bd", "#8c564b", "#e377c2"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [9, 13, 15, 17],
      chartID: "ghg-emissions-by-sector-pie",
    },
    // Chart 4: Area Chart
    {
      title_ge: "სექტორების წილი ჯამურ ემისიებში",
      title_en: "Sector Share in Total Emissions",
      unit_ge: "მეგატონა",
      unit_en: "Megatonne",
      colors: ["#ff7f0e", "#9467bd", "#8c564b", "#e377c2"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [9, 13, 15, 17],
      chartID: "ghg-sector-contribution-percent",
    },
    // Chart 5: Bar Chart
    {
      title_ge: "ემისიები წვისა და სამრეწველო პროცესებიდან",
      title_en: "Emissions from Combustion and Industrial Processes",
      unit_ge: "მეგატონა",
      unit_en: "Megatonne",
      colors: ["#17becf", "#bcbd22", "#7f7f7f"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [10, 11, 12],
      chartID: "ghg-combustion-industrial-bar",
    },
    // Chart 6: Horizontal Bar Chart
    {
      title_ge: "LULUCF სექტორის ემისიების/შთანთქმის სალდო",
      title_en: "LULUCF Sector Emissions/Removals Balance",
      unit_ge: "მეგატონა (CO2 ეკვივალენტი)",
      unit_en: "Megatonne (CO2 equivalent)",
      colors: ["#2ca02c"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [7],
      chartID: "ghg-lulucf-balance",
    },
    // Chart 7: Scatter Chart
    {
      title_ge: "ჯამური ემისიები მშპ-სთან მიმართებაში",
      title_en: "Total Emissions vs. GDP",
      unit_ge: "მეგატონა / მლრდ. საერთ. დოლარი",
      unit_en: "Megatonne / Billion Intl. Dollar",
      colors: ["#8884d8"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [6, 22],
      chartID: "ghg-emissions-vs-gdp-scatter",
    },
    // Chart 8: Scatter Chart
    {
      title_ge: "HFC ემისიები დროში",
      title_en: "HFC Emissions Over Time",
      unit_ge: "კილოტონა",
      unit_en: "kt",
      colors: ["#e74c3c"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [3],
      chartID: "ghg-hfc-emissions-scatter",
    },
    // Chart 9: Line Chart
    {
      title_ge: "ძირითადი ინდიკატორების დინამიკა",
      title_en: "Dynamics of Key Indicators",
      unit_ge: "შესაბამისი ერთეულები",
      unit_en: "Respective Units",
      colors: ["#ff7f0e", "#8c564b", "#9467bd"], // Orange, Brown, Purple
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [6, 18, 22], // Total Emissions, Population, GDP
      chartID: "ghg-key-indicators-dynamics",
    },
    // --- 2. ADD THE CONFIGURATION for the new AreaCharts2 ---
    {
      title_ge: "სათბურის გაზების ემისიები სექტორების ტიპის მიხედვით",
      title_en: "Greenhouse Gas Emissions by sector",
      unit_ge: "მეგატონა CO2 ეკვივალენტი",
      unit_en: "Megatonne of CO2 Equivalent",
      colors: ["#3498DB", "#5DADE2", "#85C1E9", "#AED6F1"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [9, 13, 15, 17], // NOTE: These indices are for reference, the chart component hardcodes them.
      chartID: "ghg-emissions-by-gas-type-area",
    },
    {
      title_ge: "საწვავის წვა სტაციონარულ და მობილურ წყაროებში",
      title_en: "Fuel Combustion in Stationary vs. Mobile Sources",
      unit_ge: "მეგატონა",
      unit_en: "Megatonne",
      colors: ["#C0392B", "#F1C40F"],
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [10, 11],
      chartID: "ghg-fuel-combustion-sources-line",
    },
    {
      title_ge: "ემისიები ერთ სულ მოსახლეზე და მშპ-ს ერთეულზე",
      title_en: "Emissions per Capita and per Unit of GDP",
      unit_ge: "ტონა/სულზე | ტონა/1000$ (მუპ)",
      unit_en: "Tonne/Capita | Tonne/1000$ (PPP)",
      colors: ["#8E44AD", "#16A085"], // Purple and Teal
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      chartID: "ghg-emissions-per-capita-and-gdp",
    },
    {
      title_ge: "ემისიები ერთ სულ მოსახლეზე და მშპ-ს ერთეულზე",
      title_en: "Emissions per Capita and per Unit of GDP",
      unit_ge: "ტონა/სულზე | ტონა/1000$ (მუპ)",
      unit_en: "Tonne/Capita | Tonne/1000$ (PPP)",
      colors: ["#8E44AD", "#16A085"], // Purple and Teal
      id: "greenhouse-gas-emissions",
      types: ["data", "metadata"],
      selectedIndices: [19, 23],
      chartID: "ghg-emissions-per-capita-and-gdp",
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 40%",
        }}>
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Greenhouse Gas Emissions in Georgia"
            : "სათბურის აირების გაფრქვევები საქართველოში"}
        </h1>
      </div>

      <div className="charts-section">
        <div className="chart-container" style={{ width: "100%" }}>
          <LineChart1 chartInfo={ChartInfo[0]} />
          <AreaCharts chartInfo={ChartInfo[1]} />
          <PieCharts chartInfo={ChartInfo[2]} />
          <AreaCharts5 chartInfo={ChartInfo[3]} />
          <BarCharts chartInfo={ChartInfo[4]} />
          <HorizontalBarCharts chartInfo={ChartInfo[5]} />
          <ScatterCharts chartInfo={ChartInfo[6]} />
          <ScatterChart9 chartInfo={ChartInfo[7]} />
          <LineChart2 chartInfo={ChartInfo[8]} />
          <AreaCharts2 chartInfo={ChartInfo[9]} />
          <LineCharts3 chartInfo={ChartInfo[10]} />
          <LineCharts4 chartInfo={ChartInfo[11]} />
        </div>
      </div>
    </div>
  );
};

export default Emissions;
