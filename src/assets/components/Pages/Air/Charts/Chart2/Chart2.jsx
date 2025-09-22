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
  Brush,
} from "recharts";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import fetchData from "../../../../../function/fetchData";
import Download from "../../../../Download/Download";

const Chart2 = () => {
  const { language } = useParams();
  const [pollution, setPollution] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activeBars, setActiveBars] = useState([]);
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState(null);

  const totalText = language === "ge" ? "წარმოქმნილი" : "Generated";

  const info = useMemo(
    () => ({
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა ქალაქების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by cities",
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
      colors: ["#06bd3dff", "#e75816ff"],
      svg: Svg(),
      id: "air-pollution-cities",
      types: ["data", "metadata"],
    }),
    []
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
          fetchData(info.id, info.types[0], language),
          fetchData(info.id, info.types[1], language),
        ]);

        const regions =
          metaDataResult.data.metadata.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          );
        const years = metaDataResult.data.metadata.variables[1].valueTexts.map(
          (year, i) => ({ year: year, id: i })
        );
        setCities(regions);
        setCity(regions[0]?.name || null);

        const pollution = metaDataResult.data.metadata.variables[2].valueTexts
          .slice(1)
          .map((poll, i) => ({ pollution: poll, id: i + 1 }));

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

  // Filter data for selected city and sort by year
  const sortedData = useMemo(() => {
    const filteredData = chartData?.filter((d) => d.region === city) || [];
    return filteredData.sort((a, b) => a.year - b.year);
  }, [chartData, city]);

  // Pollution labels for display (in language)
  const pollutionLabels = pollution?.reduce((acc, p) => {
    acc[p.id] = p.pollution;
    return acc;
  }, {}) || { 1: "Captured", 2: "Emitted" };

  // Toggle bar visibility
  const toggleBar = (dataKey) => {
    setActiveBars((prev) => {
      if (prev.length === 1 && prev.includes(dataKey)) {
        return prev;
      }
      return prev.includes(dataKey)
        ? prev.filter((bar) => bar !== dataKey)
        : [...prev, dataKey];
    });
  };

  const CustomTooltip = ({ active, payload, label, pollutionLabels }) => {
    if (!active || !payload || !payload.length) return null;

    const total = payload.reduce((sum, { value }) => sum + value, 0);

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {label} {language === "en" ? "Year" : "წელი"}{" "}
          </p>
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
              style={{ backgroundColor: "#148664ff" }}
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
    <div className="chart-wrapper">
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
          <Download />
        </div>
      </div>
      <div className="city-list">
        {cities?.map((c) => (
          <span
            key={`city-${c.id}`}
            className={`city-item ${city === c.name ? "active" : ""}`}
            onClick={() => setCity(c.name)}>
            {c.name}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            content={
              <CustomTooltip
                pollutionLabels={pollutionLabels}
                language={language}
              />
            }
          />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
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
          <Brush
            dataKey="year"
            height={20}
            stroke="#8884d8"
            travellerWidth={5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2;
