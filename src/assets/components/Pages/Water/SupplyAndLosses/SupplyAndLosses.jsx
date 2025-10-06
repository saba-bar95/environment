import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import backgroundImg from "./Background/background.jpg";
import "./SupplyAndLosses.scss";
import Faucet from "./Svgs/Faucet";
import image1 from "./images/image-1.png";
import image2 from "./images/image-2.png";
import image3 from "./images/image-3.png";
import Clean from "./Svgs/Clean";

const SupplyAndLosses = () => {
  const { language } = useParams();
  const wave1Ref = useRef(null);
  const [waveHeight, setWaveHeight] = useState(0);

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
      <div className="charts-section"></div>
    </div>
  );
};

export default SupplyAndLosses;
