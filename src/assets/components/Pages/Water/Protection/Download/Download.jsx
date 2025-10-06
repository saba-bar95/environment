import { useState, useRef, useEffect } from 'react';
import downloadPNG from './downloadPNG';
import downloadJPG from './downloadJPG';
import downloadExcel from './downloadExcel';
import downloadPDF from './downloadPDF';
import Dots from './Svgs/Dots';
import Excel from './Svgs/Excel';
import PDF from './Svgs/PDF';
import JPG from './Svgs/JPG';
import PNG from './Svgs/PNG';

/**
 * All class names prefixed with `wc-` to avoid collisions with site menus.
 */
const Download = ({ chartRef, data, filename }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !e.target.closest('.wc-download-trigger')
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownload = (fn) => {
        fn();
        setIsOpen(false);
    };

    return (
        <div className="wc-download">
            <button
                className="wc-download-trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Download menu"
                type="button"
            >
                <Dots />
            </button>

            {isOpen && (
                <div className="wc-dropdown" ref={dropdownRef}>
                    <button className="wc-dropdown-item" onClick={() => handleDownload(() => downloadExcel(data, filename))}>
                        <Excel /><span>Excel</span>
                    </button>
                    <button className="wc-dropdown-item" onClick={() => handleDownload(() => downloadPDF(data, filename))}>
                        <PDF /><span>PDF</span>
                    </button>
                    <button className="wc-dropdown-item" onClick={() => handleDownload(() => downloadJPG(chartRef, filename))}>
                        <JPG /><span>JPG</span>
                    </button>
                    <button className="wc-dropdown-item" onClick={() => handleDownload(() => downloadPNG(chartRef, filename))}>
                        <PNG /><span>PNG</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Download;
