import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';
const META_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/metadata';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForTable(apiData, apiMetadata) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return { tableData: [], latestYear: null };
    }

    // Find the data for the latest year available
    const latestYearData = apiData.data.data.reduce((latest, current) =>
        current.year > latest.year ? current : latest
    );

    const latestYear = latestYearData.year;

    // Get location names from metadata to keep it dynamic
    const locationNames = apiMetadata.data.metadata.variables.find(v => v.code === 'Locations').valueTexts;

    const locations = [
        { name: locationNames[0], prefix: 'GEO' },
        { name: locationNames[2], prefix: 'SAMEGRELO' }, // Matching screenshot order
        { name: locationNames[3], prefix: 'KVEMO_KARTLI' },
        { name: locationNames[1], prefix: 'TBILISI' },
    ];

    const tableData = locations.map(loc => {
        const deviation = latestYearData[`${loc.prefix} - DEVIATION`] || 0;

        return {
            name: loc.name,
            annual: latestYearData[`${loc.prefix} - ANNUAL`] || 0,
            deviation: (deviation - 1) * 100, // Convert ratio to percentage
            max_monthly: latestYearData[`${loc.prefix} - MAX_MONTHLY`] || 0,
            min_monthly: latestYearData[`${loc.prefix} - MIN_MONTHLY`] || 0
        };
    });

    return { tableData, latestYear };
}

// --- STYLES FOR THE TABLE ---
const styles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'sans-serif',
    },
    th: {
        textAlign: 'left',
        padding: '12px 8px',
        borderBottom: '2px solid #e5e7eb',
        color: '#6b7280',
        fontWeight: '600',
        fontSize: '14px',
    },
    td: {
        textAlign: 'left',
        padding: '12px 8px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '14px',
    },
    negative: {
        color: '#ef4444', // Red for negative values
    }
};


// --- THE TABLE COMPONENT ---
const PrecipitationTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <table style={styles.table}>
            <thead>
            <tr>
                <th style={styles.th}>რეგიონი</th>
                <th style={styles.th}>წლიური (მმ)</th>
                <th style={styles.th}>გადახრა</th>
                <th style={styles.th}>მაქს. თვე</th>
                <th style={styles.th}>მინ. თვე</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr key={row.name}>
                    <td style={{...styles.td, fontWeight: '500'}}>{row.name}</td>
                    <td style={styles.td}>{row.annual.toFixed(2)}</td>
                    <td style={{...styles.td, ...styles.negative}}>{row.deviation.toFixed(1)}%</td>
                    <td style={{...styles.td, color: '#0ea5e9'}}>{row.max_monthly.toFixed(2)}</td>
                    <td style={{...styles.td, color: '#8b5cf6'}}>{row.min_monthly.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};


// --- MAIN PAGE COMPONENT ---
const TablePage = () => {
    const [tableData, setTableData] = useState(null);
    const [latestYear, setLatestYear] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataResponse, metaResponse] = await Promise.all([
                    fetch(DATA_URL),
                    fetch(META_URL)
                ]);
                if (!dataResponse.ok || !metaResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();
                const apiMetadata = await metaResponse.json();

                const { tableData, latestYear } = transformDataForTable(apiData, apiMetadata);
                setTableData(tableData);
                setLatestYear(latestYear);

            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                12. ნალექების დეტალური მონაცემები ({latestYear})
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {tableData && (
                <div style={{ overflowX: 'auto', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <PrecipitationTable data={tableData} />
                </div>
            )}
        </div>
    );
};

export default TablePage;
