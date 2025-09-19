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
import fetchData from "../../../../../function/fetchData";
import Download from "../../../../Download/Download";

const Chart3 = () => {
  const { language } = useParams();
  const [rawData, setRawData] = useState(null);
  const [substances, setSubstances] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);

  const info = useMemo(
    () => ({
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა ქალაქების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by cities",
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
      colors: ["#63b8e9ff"],
      svg: Svg(),
      id: "transport-emissions",
      types: ["data", "metadata"],
    }),
    []
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          fetchData(info.id, info.types[0], language),
          fetchData(info.id, info.types[1], language),
        ]);

        const substanceList =
          metaDataResult.data.metadata.variables[0].valueTexts
            .map((name, id) => ({ name, id }))
            .filter((_, i) => [0, 1, 2, 7].includes(i));

        const yearList =
          metaDataResult.data.metadata.variables[1].valueTexts.map(
            (year, id) => ({ year, id })
          );

        const transformed = [];

        dataResult.data.data.forEach((yearObj) => {
          const yearId = parseInt(yearObj.year);
          const yearName =
            yearList.find((y) => y.id === yearId)?.year || yearId;

          Object.keys(yearObj).forEach((key) => {
            if (key === "year") return;

            const substanceId = parseInt(key);
            if (isNaN(substanceId)) return;

            const substanceName =
              substanceList.find((s) => s.id === substanceId)?.name ||
              `Substance ${substanceId}`;

            transformed.push({
              substance: substanceName,
              year: parseInt(yearName),
              value: yearObj[key],
            });
          });
        });

        setSubstances(substanceList);
        setSelectedSubstance(substanceList[0]?.name || null);
        setRawData(transformed);
      } catch (error) {
        console.log("Error fetching data or metadata:", error);
      }
    };

    getData();
  }, [info.id, language, info.types]);

  const filteredData = useMemo(() => {
    if (!rawData || !selectedSubstance) return [];
    return rawData
      .filter((d) => d.substance === selectedSubstance)
      .sort((a, b) => a.year - b.year);
  }, [rawData, selectedSubstance]);

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
        {substances.map((s) => (
          <span
            key={`substance-${s.id}`}
            className={`city-item ${
              selectedSubstance === s.name ? "active" : ""
            }`}
            onClick={() => setSelectedSubstance(s.name)}>
            {s.name}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={info.colors[0]} name={selectedSubstance} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart3;
