import React, { useState, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer, Label
} from 'recharts';
import { ChartActions } from '../UI/ChartActions';
import Download from '../Download/Download.jsx';
import './ChartCard.css';

// 👇 CHANGED: Added `className` to the props
const WaterBarChart = ({ data, loading, error, language, className }) => {
    const [barVisibility, setBarVisibility] = useState({
        drinkingAndHousehold: true,
        industrialNeeds: true,
        otherPurposes: true
    });
    const chartRef = useRef(null);

    const handleLegendClick = (entry) => {
        const key = entry?.dataKey ?? entry?.value;
        if (!key) return;
        setBarVisibility(p => ({ ...p, [key]: !p[key] }));
    };

    const infoBlock = (
        <div>
            <strong>{language === 'en' ? 'About this chart' : 'დიაგრამის შესახებ'}</strong><br />
            {language === 'en'
                ? 'Breakdown of water abstraction by sector.'
                : 'წყლის ამოღება სექტორების მიხედვით.'}
            <br />
            {language === 'en'
                ? 'Source: Ministry of Environmental Protection and Agriculture of Georgia.'
                : 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო.'}
        </div>
    );

    const headerActions = data ? (
        <div className="chart-actions-inline">
            <ChartActions infoContent={infoBlock} />
            <Download chartRef={chartRef} data={data} filename="water-abstraction-by-sector" />
        </div>
    ) : null;

    return (
        // 👇 CHANGED: Applied the `className` prop here
        <div className={`chart-card wa-scope ${className || ''}`}>
            <div className="chart-header">
                <h3 className="chart-title">
                    <span className="title-icon" aria-hidden="true"></span>
                    {language === 'en' ? 'Water Abstraction by Sector' : 'წყლის გამოყენება სექტორების მიხედვით'}
                </h3>
                {headerActions}
            </div>

            {loading && <div>Loading Chart...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {data && (
                <div className="chart-wrapper" ref={chartRef}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data} margin={{ top: 5, right: 50, left: 30, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="year" tick={{ fill: '#666' }} />
                            <YAxis tick={{ fill: '#666' }}>
                                <Label
                                    value={language === 'en' ? 'Volume (mln m³)' : 'მოცულობა (მლნ. მ³)'}
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#666' }}
                                    fontSize= '10px'
                                />
                            </YAxis>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                wrapperStyle={{ paddingTop: '30px', cursor: 'pointer' }}
                                onClick={handleLegendClick}
                            />
                            <Bar
                                dataKey="drinkingAndHousehold"
                                name={language === 'en' ? 'household ' : 'შინამეურნეობა'}
                                stackId="a"
                                fill="#93c5fd"
                                hide={!barVisibility.drinkingAndHousehold}
                            />
                            <Bar
                                dataKey="industrialNeeds"
                                name={language === 'en' ? 'Industrial Needs' : 'მრეწველობა'}
                                stackId="a"
                                fill="#3b82f6"
                                hide={!barVisibility.industrialNeeds}
                            />
                            <Bar
                                dataKey="otherPurposes"
                                name={language === 'en' ? 'Agriculture and Others' : 'სოფლის მეურნეობა და სხვა'}
                                stackId="a"
                                fill="#1e3a8a"
                                hide={!barVisibility.otherPurposes}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="chart-footer">
                <p className="chart-source-note">
                    {language === 'en'
                        ? 'Source: Ministry of Environmental Protection and Agriculture of Georgia'
                        : 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო'}
                </p>
            </div>
        </div>
    );
};

export default WaterBarChart;