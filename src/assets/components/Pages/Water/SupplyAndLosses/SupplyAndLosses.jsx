import { useParams, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import backgroundImg from "./Background/background.jpg";
import "./SupplyAndLosses.scss";
import Faucet from "./Svgs/Faucet";
import image1 from "./images/image-1.png";
import image2 from "./images/image-2.png";
import image3 from "./images/image-3.png";
import Clean from "./Svgs/Clean";
import "./SupplyAndLosses2.scss";
import Charts from "../../../../../Charts";
import LineCharts from "./Charts/LineCharts";
import StackedBarCharts from "./Charts/StackedBarCharts";
import BarCharts from "./Charts/BarCharts";
import AreaCharts from "./Charts/AreaCharts";

const SupplyAndLosses = () => {
  const { language } = useParams();
  const location = useLocation(); // Get the current location to access hash

  const wave1Ref = useRef(null);
  const [waveHeight, setWaveHeight] = useState(0);
  const info = Charts.water[2].supplyandlosses;

  useEffect(() => {
    const waveElement = wave1Ref.current;

    // Initial height measurement for wave-1
    if (waveElement) {
      const initialHeight = waveElement.getBoundingClientRect().height;
      setWaveHeight(initialHeight);
    }

    // Set up ResizeObserver for wave-1
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        setWaveHeight(height);
      }
    });

    if (waveElement) {
      observer.observe(waveElement);
    }

    // Cleanup observer
    return () => {
      if (waveElement) {
        observer.unobserve(waveElement);
      }
    };
  }, []);

  // Scroll to the chart specified in the URL hash
  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]); // Re-run when the hash changes

  const ChartInfo = [
    {
      title_ge: info[0].title_ge,
      title_en: info[0].title_en,
      colors: ["#1678e7ff", "#63b8e9ff"],
      id: "water-supply-population",
      types: ["data", "metadata"],
      selectedIndices: [0, 2],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#e94d74ff"],
      id: "water-losses",
      types: ["data", "metadata"],
      selectedIndices: [3],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#4de9d4ff", "rgba(250, 208, 118, 1)"],
      id: "water-use-households",
      types: ["data", "metadata"],
      selectedIndices: [1, 3],
      chartID: info[2].chartID,
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#4de9d4ff"],
      id: "water-supply-population",
      types: ["data", "metadata"],
      selectedIndices: [5],
      chartID: info[3].chartID,
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1464dbff"],
      id: "water-use-households",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#4de9d4ff", "rgba(250, 208, 118, 1)"],
      id: "water-use-households",
      types: ["data", "metadata"],
      selectedIndices: [0, 5],
      chartID: info[5].chartID,
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#1464dbff", "#e94d74ff"],
      id: "water-use-households",
      types: ["data", "metadata"],
      selectedIndices: [5, 0],
      chartID: info[6].chartID,
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#555d69ff", "#1464dbff", "#4de9d4ff", "rgba(250, 208, 118, 1)"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 3, 5],
      chartID: info[7].chartID,
    },
    {
      title_ge: info[8].title_ge,
      title_en: info[8].title_en,
      colors: ["#4de9d4ff", "rgba(250, 208, 118, 1)"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [4, 6],
      chartID: info[8].chartID,
    },
    {
      title_ge: info[9].title_ge,
      title_en: info[9].title_en,
      colors: ["#1464dbff", "rgba(250, 208, 118, 1)", "#4de9d4ff"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [7, 9, 11],
      chartID: info[9].chartID,
    },
    {
      title_ge: info[10].title_ge,
      title_en: info[10].title_en,
      colors: ["#1464dbff", "rgba(250, 208, 118, 1)", "#4de9d4ff"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [8, 10, 12],
      chartID: info[10].chartID,
    },
    {
      title_ge: info[11].title_ge,
      title_en: info[11].title_en,
      colors: ["#e94d74ff"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [13],
      chartID: info[11].chartID,
    },
    {
      title_ge: info[12].title_ge,
      title_en: info[12].title_en,
      colors: ["#e94d74ff"],
      id: "sewerage-network-population",
      types: ["data", "metadata"],
      selectedIndices: [15],
      chartID: info[12].chartID,
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Water Supply, Losses and Household Water Consumption"
            : "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება"}
        </h1>
      </div>
      <div className="section-wrapper">
        <section>
          <div style={{ height: "100%" }} className="ss">
            <div className="texts">
              <div className="left">
                <h1>
                  {language === "en"
                    ? "Water supply and distribution"
                    : "წყალმომარაგება და განაწილება"}
                </h1>
                <p>
                  {language === "en"
                    ? "In 2023, Georgia's centralized water supply systems supplied approximately 0.87 km³ (total volume) of drinking water."
                    : "2023 წელს საქართველოს ცენტრალიზებულმა წყალმომარაგების სისტემებმა დაახლოებით 0.87 კმ³ (მთლიანი მოცულობა) სასმელი წყალი მიაწოდა."}
                </p>
                <div className="bottom">
                  <div className="rr">
                    <h2>
                      {language === "en"
                        ? "Involved Population"
                        : "ჩართული მოსახლეობა"}
                    </h2>
                    <div className="num">74.5%</div>
                  </div>
                  <div className="border"></div>
                  <div className="ll">
                    <h2>
                      {language === "en"
                        ? "Systemic Losses"
                        : "სისტემური დანაკარგები"}
                    </h2>
                    <div className="num">68.3%</div>
                  </div>
                </div>
              </div>
              <div className="right"></div>
            </div>
            <div
              style={{
                transform: `translateY(${waveHeight - waveHeight / 2}px)`,
              }}
              className="faucet-svg">
              <Faucet />
            </div>
          </div>
        </section>
        <div className="divider wave-1" ref={wave1Ref}></div>
        <section>
          <div className="ss">
            <div className="left">
              <div className="wrapper">
                <img src={image1} alt="" />
                <img src={image2} alt="" />
                <img src={image3} alt="" />
              </div>
              <div className="text">
                <h1>
                  231
                  <span>{language === "en" ? "L/day" : "ლ/დღე"}</span>
                </h1>
              </div>
            </div>
            <div className="right">
              <h1>
                {language === "en"
                  ? "Household Water Consumption"
                  : "საყოფაცხოვრებო წყლის მოხმარება"}
              </h1>
              <p>
                {language === "en"
                  ? "In 2023, the average total water consumption per capita by households was 84.3 cubic meters per year (approx. 231 liters/day)."
                  : "2023 წელს შინამეურნეობების მიერ წყლის საშუალო ჯამური მოხმარება ერთ სულ მოსახლეზე შეადგენდა 84.3 კუბურ მეტრს წელიწადში (დაახლ. 231 ლიტრი/დღეში)."}
              </p>
            </div>
          </div>
        </section>
        <div className="divider wave-2"></div>
        <section>
          <div>
            <div className="texts">
              <div className="left" style={{ flex: 22 }}>
                <h1>
                  {language === "en"
                    ? "Through wastewater treatment plants"
                    : "ჩამდინარე წყლების გამწმენდ ნაგებობებთან მიერთება"}
                </h1>
                <p>
                  {language === "en"
                    ? "In 2023, ~53.7% of the population was connected to a wastewater collection system, and ~41.2% to treatment facilities."
                    : "2023 წელს მოსახლეობის ~53.7% მიერთებული იყო ჩამდინარე წყლების შემკრებ სისტემასთან, ხოლო ~41.2% - გამწმენდ ნაგებობებთან."}
                </p>
                <div className="bottom" style={{ gap: "50px" }}>
                  <div className="rr">
                    <h2>
                      {language === "en"
                        ? "Population connected to wastewater collection system"
                        : "ჩამდინარე წყლების შემკრებ სისტემასთან მიერთებული მოსახლეობა"}
                    </h2>
                    <div className="num">53.7%</div>
                  </div>
                  <div className="border"></div>
                  <div className="ll">
                    <h2>
                      {language === "en"
                        ? "Population connected to the wastewater treatment plant"
                        : "გამწმენდ ნაგებობასთან მიერთებული მოსახლეობა"}
                    </h2>
                    <div className="num">41.2%</div>
                  </div>
                </div>
              </div>
              <div className="right">
                <Clean />
              </div>
            </div>
          </div>
        </section>
        <div className="divider wave-3"></div>
      </div>
      <div className="header-container1">
        <h1 className="title-text">
          {language === "en"
            ? "Detailed Water Statistics (2015-2023)"
            : "წყლის დეტალური სტატისტიკა (2015-2023)"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <LineCharts chartInfo={ChartInfo[0]} />
          <LineCharts chartInfo={ChartInfo[1]} />
          <StackedBarCharts chartInfo={ChartInfo[2]} />
          <LineCharts chartInfo={ChartInfo[3]} />
          <LineCharts chartInfo={ChartInfo[4]} />
          <StackedBarCharts chartInfo={ChartInfo[5]} />
          <LineCharts chartInfo={ChartInfo[6]} />
          <LineCharts chartInfo={ChartInfo[7]} />
          <BarCharts chartInfo={ChartInfo[8]} />
          <StackedBarCharts chartInfo={ChartInfo[9]} />
          <StackedBarCharts chartInfo={ChartInfo[10]} />
          <LineCharts chartInfo={ChartInfo[11]} />
          <AreaCharts chartInfo={ChartInfo[12]} />
        </div>
      </div>
    </div>
  );
};

export default SupplyAndLosses;
