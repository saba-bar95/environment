import React, { useRef } from "react";

const TemperatureToolbar = ({ fileBase = "temperature", getData, getNode }) => {
    const busyRef = useRef(false);

    const safeCall = (fn, ...args) => {
        try { return fn?.(...args); } catch { return undefined; }
    };

    const onPDF = async () => {
        if (busyRef.current) return;
        busyRef.current = true;
        try {
            const mod = await import("../../Water/Protection/Charts/Download/downloadPDF.js");
            const downloadPDF = mod?.default || mod?.downloadPDF;
            if (!downloadPDF) return;

            const node = safeCall(getNode) || document.querySelector(".chart-wrapper");
            await downloadPDF({
                node,
                fileName: `${fileBase}.pdf`,
            });
        } finally {
            busyRef.current = false;
        }
    };

    const onExcel = async () => {
        if (busyRef.current) return;
        busyRef.current = true;
        try {
            const mod = await import("../../Water/Protection/Charts/Download/downloadExcel.js");
            const downloadExcel = mod?.default || mod?.downloadExcel;
            if (!downloadExcel) return;

            const data = safeCall(getData) || [];
            await downloadExcel({
                rows: data,
                fileName: `${fileBase}.xlsx`,
            });
        } finally {
            busyRef.current = false;
        }
    };

    return (
        <div className="chart-toolbar">
            <div className="toolbar-spacer" />
            <div className="toolbar-actions">
                <button className="toolbar-button" onClick={onPDF}>PDF</button>
                <button className="toolbar-button" onClick={onExcel}>Excel</button>
            </div>
        </div>
    );
};

export default TemperatureToolbar;