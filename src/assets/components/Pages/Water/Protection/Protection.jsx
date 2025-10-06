// src/assets/components/Pages/Water/Protection/Protection.jsx

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import backgroundImg from './Background/background.jpg';
import WaterAbstractionChart from './Charts/WaterAbstractionChart.jsx';
import WaterBarChart from './Charts/WaterBarChart.jsx';
import StackedAreaChart from './Charts/StackedAreaChart.jsx';
import DonutChart from './Charts/DonutChart.jsx';

const DATA_URL = 'http://192.168.1.27:3000/api/datasets/water-abstraction/data';

const Protection = () => {
    const {language} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [barData, setBarData] = useState(null);
    const [lossesData, setLossesData] = useState(null);
    const [wastewaterData, setWastewaterData] = useState(null);
    const [donutData, setDonutData] = useState(null);
    const [latestYear, setLatestYear] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(DATA_URL);
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const json = await res.json();
                const rows = json.data.data;
                const yearMap = json.data.metadata.yearMapping;

                const mapYear = (yIdx) => {
                    const f = yearMap.find(m => m.index === yIdx);
                    return f ? f.value : yIdx;
                };

                setLineData(rows.map(r => ({
                    year: mapYear(r.year),
                    totalAbstraction: r['0'] || 0,
                    groundwaterAbstraction: r['1'] || 0
                })));
                setBarData(rows.map(r => ({
                    year: mapYear(r.year),
                    drinkingAndHousehold: r['3'] || 0,
                    industrialNeeds: r['4'] || 0,
                    otherPurposes: r['5'] || 0
                })));
                setLossesData(rows.map(r => ({year: mapYear(r.year), losses: r['8'] || 0, recycling: r['9'] || 0})));
                setWastewaterData(rows.map(r => ({
                    year: mapYear(r.year),
                    totalDischarge: r['6'] || 0,
                    pollutedDischarge: r['7'] || 0
                })));

                if (rows.length > 0) {
                    const latestYearData = rows[rows.length - 1];
                    setLatestYear(mapYear(latestYearData.year));

                    const val3 = latestYearData['3'] || 0;
                    const val4 = latestYearData['4'] || 0;
                    const val5 = latestYearData['5'] || 0;
                    const total = val3 + val4 + val5;

                    if (total > 0) {
                        const donutChartData = [
                            {name: language === 'en' ? 'Other Purposes' : 'სხვა მიზნით', value: (val5 / total) * 100},
                            {
                                name: language === 'en' ? 'Industrial Needs' : 'საწარმოო საჭიროებები',
                                value: (val4 / total) * 100
                            },
                            {
                                name: language === 'en' ? 'Drinking & Household' : 'სასმელ-სამეურნეო',
                                value: (val3 / total) * 100
                            },
                        ];
                        setDonutData(donutChartData);
                    } else {
                        setDonutData([]);
                    }
                }

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [language]);

    const donutChartTitle = latestYear
        ? (language === 'en' ? `Water Usage Distribution for ${latestYear}` : `${latestYear} წლის გამოყენების განაწილება სექტორების მიხედვით %`)
        : (language === 'en' ? 'Water Usage Distribution' : 'გამოყენების განაწილება სექტორების მიხედვით %');

    return (
        // This class is our main scope for the CSS file
        <div className="section-container water-protection-scope">
            <div className="background-container"
                 style={{backgroundImage: `url(${backgroundImg})`, backgroundPosition: 'center 45%'}}>
                <div className="overlay"/>
                <h1>{language === 'en' ? 'Trends in Water Abstraction from Natural Sources in Georgia (2017–2023)' : 'ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში(2017-2023)'}</h1>
            </div>

            <div className="page-content">
                {/* 👇 CHANGED: Added className prop for standalone centering */}
                <WaterAbstractionChart className="chart-card--standalone" data={lineData} loading={loading}
                                       error={error} language={language}/>
                <WaterBarChart className="chart-card--standalone" data={barData} loading={loading} error={error}
                               language={language}/>
                <StackedAreaChart className="chart-card--standalone" data={lossesData} loading={loading} error={error}
                                  language={language}
                                  title={language === 'en' ? 'Water losses during transportation and recirculated water supply' : 'წყლის დანაკარგი ტრანსპორტირებისას და ბრუნვითი წყალმომარაგება'}
                                  dataKey1="losses" name1={language === 'en' ? 'Water losses' : 'წყლის დანაკარგები'}
                                  dataKey2="recycling"
                                  name2={language === 'en' ? 'Recirculated and reused water supply' : 'ბრუნვითი და მეორადი წყალმომარაგება'}/>

                {/* 👇 UNCHANGED: These charts in a row do not need the standalone class */}
                <div className="chart-row chart-row--60-40">
                    <StackedAreaChart
                        data={wastewaterData}
                        loading={loading}
                        error={error}
                        language={language}
                        title={language === 'en' ? 'Wastewater Discharge' : 'ჩამდინარე წყლის ჩაშვება'}
                        dataKey1="pollutedDischarge"
                        name1={language === 'en' ? 'Polluted Discharge' : 'დაბინძურებული ჩამდინარე წყლები'}
                        dataKey2="totalDischarge"
                        name2={language === 'en' ? 'Total Discharge' : 'ჩაშვება, სულ'}
                        chartHeight={400}
                        yAxisLabel={language === 'en' ? 'Discharge (mln m³)' : 'ჩაშვება (მლნ. მ³)'}
                    />
                    <DonutChart
                        data={donutData}
                        loading={loading}
                        error={error}
                        language={language}
                        title={donutChartTitle}
                    />
                </div>
            </div>
        </div>
    );
};

export default Protection;