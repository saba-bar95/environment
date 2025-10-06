import React, { useRef, useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer, Label
} from 'recharts';
import { ChartActions } from '../UI/ChartActions';
import Download from '../Download/Download.jsx';
import './ChartCard.css';

const COLORS = {
    primary: '#0284c7',
    secondary: '#3b82f6',
    grid: 'rgba(0,0,0,.08)',
    text: '#6B7280'
};

const StackedAreaChart = ({
                              data,
                              loading,
                              error,
                              title,
                              dataKey1,
                              name1,
                              dataKey2,
                              name2,
                              language,
                              chartHeight = 350,
                              yAxisLabel,
                              className
                          }) => {
    const chartRef = useRef(null);
    const [visibility, setVisibility] = useState({});

    useEffect(() => {
        setVisibility({
            [dataKey1]: true,
            [dataKey2]: true
        });
    }, [dataKey1, dataKey2]);

    const handleLegendClick = (entry) => {
        const key = entry?.dataKey ?? entry?.value;
        if (!key) return;
        setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const infoBlock = (
        <div>
            <strong>{language === 'en' ? 'About this chart' : 'დიაგრამის შესახებ'}</strong><br />
            {language === 'en'
                ? 'This chart displays water losses during transportation and recycled water supply over time.'
                : 'ეს დიაგრამა აჩვენებს წყლის დანაკარგებს ტრანსპორტირებისას და ბრუნვითი წყალმომარაგების მონაცემებს დროის მიხედვით.'}
        </div>
    );

    const hasData = data && data.length > 0;
    const defaultYAxisLabel = language === 'en' ? 'Volume (mln m³)' : 'მოცულობა (მლნ. მ³)';

    return (
        <div className={`chart-card sa-scope ${className || ''}`}>
            <div className="chart-header">
                <h3 className="chart-title">
                    <span className="title-icon" aria-hidden="true"></span>
                    {title}
                </h3>
                {hasData && (
                    <div className="chart-actions-inline">
                        <ChartActions infoContent={infoBlock} />
                        <Download chartRef={chartRef} data={data} filename="stacked-area-chart" />
                    </div>
                )}
            </div>

            {loading && <div>Loading Chart...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {hasData && (
                <div className="chart-wrapper" ref={chartRef} style={{ height: `${chartHeight}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 8, right: 16, left: 10, bottom: 26 }}
                        >
                            <defs>
                                <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: COLORS.text, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={10}
                            />
                            <YAxis
                                width={56}
                                tick={{ fill: COLORS.text, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            >
                                <Label
                                    value={yAxisLabel || defaultYAxisLabel}
                                    angle={-90}
                                    position="insideLeft"
                                    offset={10}
                                    style={{
                                        textAnchor: 'middle',
                                        fill: COLORS.text,
                                        fontSize: 12,
                                        fontWeight: 500
                                    }}
                                />
                            </YAxis>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                height={20}
                                wrapperStyle={{
                                    paddingTop: 12,
                                    cursor: 'pointer',
                                    fontSize: 12
                                }}
                                onClick={handleLegendClick}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey1}
                                name={name1}
                                stroke={COLORS.primary}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorGradient1)"
                                hide={!visibility[dataKey1]}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey2}
                                name={name2}
                                stroke={COLORS.secondary}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorGradient2)"
                                hide={!visibility[dataKey2]}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!loading && !error && !hasData && <div>No data available.</div>}

            <div className="chart-footer">
                <p className="chart-source-note">
                    {language === 'en' ? 'Source: Ministry of Environmental Protection and Agriculture of Georgia' : 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო'}
                </p>
            </div>
        </div>
    );
};

export default StackedAreaChart;
