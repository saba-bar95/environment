import React, { useRef } from "react";
import TemperatureToolbar from "./TemperatureToolbar.jsx";

const ChartCard = ({ title, fileBase, getData, children }) => {
    const cardRef = useRef(null);

    return (
        <div className="chart-wrapper" ref={cardRef}>
            {title ? <h3 className="chart-title">{title}</h3> : null}
            <TemperatureToolbar
                fileBase={fileBase}
                getData={getData}
                getNode={() => cardRef.current}
            />
            <div className="chart-content">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
