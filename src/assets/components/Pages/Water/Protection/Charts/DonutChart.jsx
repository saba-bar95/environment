import React, { useRef, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartActions } from '../UI/ChartActions';
import Download from '../Download/Download.jsx';
import './ChartCard.css';

const COLORS = ['#60a5fa', '#3b82f6', '#1e3a8a'];


const CustomLegend = ({ payload, visibility, onClick }) => (
    <ul className="custom-legend">
        {payload.map((entry, index) => (
            <li
                key={`item-${index}`}
                className="custom-legend-item"
                onClick={() => onClick(entry.name)} // Use entry.name for the click handler
                style={{ opacity: visibility[entry.name] ? 1 : 0.5, cursor: 'pointer' }}
            >
                <div>
                    <span className="legend-color-box" style={{ backgroundColor: entry.color }} />
                    <span className="legend-text">{entry.name}</span>
                </div>
                {/* This new span will display the percentage */}
                <span className="legend-value">{entry.value.toFixed(1)}%</span>
            </li>
        ))}
    </ul>
);

const DonutChart = ({ data, title, loading, error, language, className }) => {
    const chartRef = useRef(null);
    const hasData = data && data.length > 0;
    const [visibility, setVisibility] = useState({});

    useEffect(() => {
        if (hasData) {
            setVisibility(data.reduce((acc, entry) => {
                acc[entry.name] = true;
                return acc;
            }, {}));
        }
    }, [data]);

    const handleLegendClick = (itemName) => {
        setVisibility(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const visibleData = hasData ? data.filter(entry => visibility[entry.name]) : [];

    const infoBlock = (
        <div>
            <strong>{language === 'en' ? 'About this chart' : 'დიაგრამის შესახებ'}</strong><br />
            {language === 'en'
                ? 'Distribution of water usage by sector for the most recent year.'
                : 'წყლის გამოყენების განაწილება სექტორების მიხედვით ბოლო წლისთვის.'}
        </div>
    );

    return (
        <div className={`do-scope chart-card ${className || ''}`}>
            <div className="chart-header">
                <h3 className="chart-title">
                    <span className="title-icon" aria-hidden="true"></span>
                    {title}
                </h3>
                {hasData && (
                    <div className="chart-actions-inline">
                        <ChartActions infoContent={infoBlock} />
                        <Download chartRef={chartRef} data={data} filename="water-usage-distribution" />
                    </div>
                )}
            </div>
            <div className="chart-wrapper" ref={chartRef}>
                {loading && <div>Loading Chart...</div>}
                {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                {!loading && !error && !hasData && <div>No data available.</div>}
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={visibleData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}

                                innerRadius="60%"
                                outerRadius="85%"
                                fill="#8884d8"
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {visibleData.map((entry, index) => {
                                    const originalIndex = data.findIndex(d => d.name === entry.name);
                                    return <Cell key={`cell-${index}`} fill={COLORS[originalIndex % COLORS.length]} />;
                                })}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
            {hasData && (
                <CustomLegend
                    payload={data.map((entry, index) => ({
                        name: entry.name,
                        value: entry.value,
                        color: COLORS[index % COLORS.length]
                    }))}
                    visibility={visibility}
                    onClick={handleLegendClick}
                />
            )}
        </div>
    );
};

export default DonutChart;