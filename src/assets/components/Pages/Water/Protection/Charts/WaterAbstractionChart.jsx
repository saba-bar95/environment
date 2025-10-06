// src/assets/components/Pages/Water/Protection/Charts/WaterAbstractionChart.jsx

import React, { useState, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer, Label
} from 'recharts';
import { ChartActions } from '../UI/ChartActions';
import Download from '../Download/Download.jsx';
import './ChartCard.css';

const COLORS = {
    primary: '#1E3D8E',
    secondary: '#66A0F7',
    grid: 'rgba(0,0,0,.08)',
    text: '#6B7280'
};

const WaterAbstractionChart = ({
                                   data, loading, error, language,
                                   height = 410,
                                   className // 👇 CHANGED: Accept className as a prop
                               }) => {
    const [visibility, setVisibility] = useState({
        totalAbstraction: true,
        groundwaterAbstraction: true
    });
    const chartRef = useRef(null);

    const handleLegendClick = (entry) => {
        const key = entry?.dataKey ?? entry?.value;
        if (!key) return;
        setVisibility(v => ({ ...v, [key]: !v[key] }));
    };

    const infoBlock = (
        <div>
            <strong>{language === 'en' ? 'About this chart' : 'დიაგრამის შესახებ'}</strong><br />
            {language === 'en'
                ? 'Displays total and groundwater abstractions by year.'
                : 'ნაჩვენებია წყლის საერთო და მიწისქვეშა აღება წლების მიხედვით.'}
            <br />
            {language === 'en'
                ? 'Source: Ministry of Environmental Protection and Agriculture of Georgia.'
                : 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო.'}
        </div>
    );

    const titleText = language === 'en'
        ? 'Water Abstraction from Natural Sources'
        : 'წყლის აღება ბუნებრივი ობიექტებიდან';

    return (
        // 👇 CHANGED: Combine the default classes with the passed-in className prop
        <div className={`la-scope chart-card ${className || ''}`}>
            <div className="chart-header">
                <h3 className="chart-title">
                    <span className="title-icon" aria-hidden="true"></span>
                    {titleText}
                </h3>
                <div className="chart-actions-inline">
                    <ChartActions infoContent={infoBlock} />
                    {data && <Download chartRef={chartRef} data={data} filename="water-abstraction" />}
                </div>
            </div>

            {loading && <div>Loading Chart...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {data && (
                <div className="chart-wrapper" ref={chartRef} style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 8, right: 16, left: 10, bottom: 26 }}
                        >
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" />
                            <XAxis dataKey="year" tick={{ fill: COLORS.text, fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={10} />
                            <YAxis width={56} tick={{ fill: COLORS.text, fontSize: 12 }} tickLine={false} axisLine={false}>
                                <Label value={language === 'en' ? 'Volume (mln m³)' : 'მოცულობა (მლნ. მ³)'} angle={-90} position="insideLeft" offset={10} style={{ textAnchor: 'middle', fill: COLORS.text, fontSize: 12, fontWeight: 500 }} />
                            </YAxis>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" height={20} wrapperStyle={{ paddingTop: 12, cursor: 'pointer', fontSize: 12 }} onClick={handleLegendClick} />
                            <Line type="monotone" dataKey="totalAbstraction" name={language === 'en' ? 'Total Abstraction' : 'სულ წყლის აღება'} stroke={COLORS.primary} strokeWidth={2} dot={{ r: 2.5, stroke: '#fff', strokeWidth: 1 }} activeDot={{ r: 4 }} hide={!visibility.totalAbstraction} />
                            <Line type="monotone" dataKey="groundwaterAbstraction" name={language === 'en' ? 'Groundwater Abstraction' : 'მიწისქვეშა წყლის აღება'} stroke={COLORS.secondary} strokeWidth={2} dot={{ r: 2.5, stroke: '#fff', strokeWidth: 1 }} activeDot={{ r: 4 }} hide={!visibility.groundwaterAbstraction} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="chart-footer">
                <p className="chart-source-note">
                    {language === 'en' ? 'Source: Ministry of Environmental Protection and Agriculture of Georgia' : 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო'}
                </p>
            </div>
        </div>
    );
};

export default WaterAbstractionChart;