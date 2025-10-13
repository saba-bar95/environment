
const CustomAreaTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip">
            <div className="tooltip-container">
                <p className="tooltip-label">{`${label}`}</p>

                {payload.map(({ name, value, stroke, color, fill }, index) => (
                    <p key={`item-${index}`} className="text">
            <span
                style={{ backgroundColor: stroke || color || fill }}
                className="before-span"></span>
                        {name} :
                        <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {value !== undefined && value !== null ? value.toFixed(1) : "N/A"}
            </span>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default CustomAreaTooltip;