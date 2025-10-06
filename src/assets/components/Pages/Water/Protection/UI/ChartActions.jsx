import React, { useEffect, useRef, useState } from "react";

export const ChartActions = ({ infoContent }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    return (
        <div className="wc-actions">
            <div className="wc-info" ref={ref}>
                <button type="button" className="wc-icon-btn" aria-label="Info" onClick={() => setOpen(v => !v)}>
                    {/* Corrected SVG for a question mark icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                </button>
                {open && <div className="wc-info-popover">{infoContent}</div>}
            </div>
        </div>
    );
};