import React from "react";


const COLORS = {
    primary: '#0284c7',
    secondary: '#3b82f6',
    grid: 'rgba(0,0,0,.08)',
    text: '#6B7280'
};


const CustomLegend = ({ payload, onClick, visibilityState }) => (
    <ul className="recharts-default-legend" style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', gap: '24px' }}>
        {payload.map((entry, index) => (
            <li
                key={`item-${index}`}
                className={`recharts-legend-item ${visibilityState[entry.dataKey] ? "active" : "inactive"}`}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => onClick(entry)}
            >
                <span
                    style={{
                        backgroundColor: entry.color,
                        width: '10px',
                        height: '10px',
                        display: 'inline-block',
                        marginRight: '8px'
                    }}
                ></span>
                <span className="recharts-legend-item-text" style={{ color: COLORS.text, fontSize: 12 }}>
                    {entry.value}
                </span>
            </li>
        ))}
    </ul>
);


export default CustomLegend;