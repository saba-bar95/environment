import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import commonData from "../../../../../fetchFunctions/commonData";
import YearDropdown from "../../../../YearDropdown/YearDropdown";
import Download from "../Download/Download";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [pollution, setPollution] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activeBars, setActiveBars] = useState([]);
  const [year, setYear] = useState(2023);
  const [years, setYears] = useState(null);

  const totalText = language === "ge" ? "წარმოქმნილი" : "Generated";

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
      colors: ["#6CD68C", "#EB4C4B", "#8884d8"],
      svg: Svg(),
      id: "air-pollution-regions",
      types: ["data", "metadata"],
    }),
    [chartInfo]
  );

  // Initialize activeBars when pollution data is loaded
  useEffect(() => {
    if (pollution) {
      setActiveBars(pollution.map((p) => `pollution_${p.id}`));
    }
  }, [pollution]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(info.id, info.types[0], language),
          commonData(info.id, info.types[1], language),
        ]);

        const regions =
          metaDataResult.data.metadata.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          );
        const years = metaDataResult.data.metadata.variables[1].valueTexts.map(
          (year, i) => ({ year: year, id: i })
        );
        setYears(metaDataResult.data.metadata.variables[1].valueTexts);

        const pollution = metaDataResult.data.metadata.variables[2].valueTexts
          .slice(1) // Skip the first item ("Generated")
          .map((poll, i) => ({ pollution: poll, id: i + 1 })); // Start id from 1

        setPollution(pollution);

        const transformData = (rawData, regions, years) => {
          const transformed = [];
          rawData.forEach((yearObj) => {
            const yearId = parseInt(yearObj.year);
            const yearName = years.find((y) => y.id === yearId)?.year || yearId;

            Object.keys(yearObj).forEach((key) => {
              if (key.includes(" - ")) {
                const [regionIdStr, pollutionIdStr] = key.split(" - ");
                const regionId = parseInt(regionIdStr);
                const pollutionId = parseInt(pollutionIdStr);

                if (!isNaN(regionId) && !isNaN(pollutionId)) {
                  const regionName =
                    regions.find((r) => r.id === regionId)?.name ||
                    `Region ${regionId}`;
                  let entry = transformed.find(
                    (e) => e.region === regionName && e.year === yearName
                  );

                  if (!entry) {
                    entry = { region: regionName, year: yearName };
                    transformed.push(entry);
                  }

                  entry[`pollution_${pollutionId}`] = yearObj[key];
                }
              }
            });
          });

          return transformed.sort(
            (a, b) => a.year - b.year || a.region.localeCompare(b.region)
          );
        };

        const transformedData = transformData(
          dataResult.data.data,
          regions,
          years
        );
        setChartData(transformedData);
      } catch (error) {
        console.log("Error fetching data or metadata:", error);
      }
    };

    getData();
  }, [info.id, language, info.types]);

  // Filter data for 2023 and sort in ascending order by pollution_0 (Total)
  const sortedData = useMemo(() => {
    const filteredData = chartData?.filter((d) => +d.year === year) || [];
    return filteredData.sort(
      (a, b) => (b.pollution_0 || 0) - (a.pollution_0 || 0)
    );
  }, [chartData, year]);

  // Pollution labels for display (in language)
  const pollutionLabels = pollution?.reduce((acc, p) => {
    acc[p.id] = p.pollution;
    return acc;
  }, {}) || { 0: "Total", 1: "Captured", 2: "Emitted" };

  // Toggle bar visibility
  const toggleBar = (dataKey) => {
    setActiveBars((prev) => {
      // If this is the last active bar, prevent hiding it
      if (prev.length === 1 && prev.includes(dataKey)) {
        return prev;
      }
      // Otherwise, toggle the bar (add if not present, remove if present)
      return prev.includes(dataKey)
        ? prev.filter((bar) => bar !== dataKey)
        : [...prev, dataKey];
    });
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label, pollutionLabels }) => {
    if (!active || !payload || !payload.length) return null;

    // Calculate total of visible payload values
    const total = payload.reduce((sum, { value }) => sum + value, 0);

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map(({ name, value, fill }, index) => {
            const displayName =
              pollutionLabels[name.replace("pollution_", "")] || name;
            return (
              <p key={`item-${index}`} className="text">
                <span
                  style={{ backgroundColor: fill }}
                  className="before-span"></span>
                {displayName} :
                <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                  {value.toFixed(1)}
                </span>
              </p>
            );
          })}
          <p className="text">
            <span
              style={{ backgroundColor: "#148664ff" }} // Black for total, or choose another color
              className="before-span"></span>
            {totalText} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {total.toFixed(1)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const CustomLegend = ({ payload, onClick, activeBars, pollutionLabels }) => (
    <ul className="recharts-default-legend">
      {payload.map((entry, index) => (
        <li
          key={`legend-item-${index}`}
          className={`recharts-legend-item legend-item-${index} ${
            activeBars.includes(entry.dataKey) ? "active" : "inactive"
          }`}
          onClick={() => onClick(entry.dataKey)}>
          <span
            className="recharts-legend-item-icon"
            style={{ backgroundColor: entry.color }}></span>
          <span className="recharts-legend-item-text">
            {pollutionLabels[entry.dataKey.replace("pollution_", "")] ||
              entry.dataKey}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll">
            <Svg />
          </div>
          <div className="rr">
            <h1>{language === "ge" ? info.title_ge : info.title_en}</h1>
            <p>{language === "ge" ? info.unit_ge : info.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <YearDropdown years={years} year={year} setYear={setYear} />
          <Download
            data={sortedData}
            year={year}
            unit={info[`unit_${language}`]}
            filename={info[`title_${language}`]}
            isChart1={true}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart data={sortedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" tick={{ fontSize: 15 }} />
          <YAxis
            dataKey="region"
            type="category"
            width={150}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />

          <Tooltip
            content={<CustomTooltip pollutionLabels={pollutionLabels} />}
          />
          <Legend
            wrapperStyle={{ marginBottom: -10 }}
            content={
              <CustomLegend
                onClick={toggleBar}
                activeBars={activeBars}
                pollutionLabels={pollutionLabels}
              />
            }
            verticalAlign="bottom"
            align="center"
          />
          {pollution?.map((p, index) => (
            <Bar
              key={`pollution_${p.id}`}
              dataKey={`pollution_${p.id}`}
              fill={info.colors[index] || "#8884d8"}
              name={`pollution_${p.id}`}
              stackId="a"
              minPointSize={3}
              hide={!activeBars.includes(`pollution_${p.id}`)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart1;
