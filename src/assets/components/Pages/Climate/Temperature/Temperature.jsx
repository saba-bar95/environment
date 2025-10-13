// File: src/assets/components/Pages/Climate/Temperature/Temperature.jsx
// ADD import + render of new bar chart under existing line chart
import React from 'react';
import { useParams } from 'react-router-dom';
import backgroundImg from './Background/background.jpg';
import AnnualTemperatureChart from './AnnualTemperatureChart';
import TemperatureAnomalyBarChart from './TemperatureAnomalyBarChart';
import TemperatureMultiIndexLineChart from './TemperatureMultiIndexLineChart';
import TemperatureMinimalTechChart from './TemperatureMinimalTechChart';
import TemperatureTechnicalSchematic from './TemperatureTechnicalSchematic';
import TemperatureRadarComparisonChart from "./TemperatureRadarComparisonChart.jsx";




import './Temperature.scss';

const HEADER_I18N = {
    en: { title: 'Air Temperature', subtitle: 'Annual and seasonal temperature trends compared to historical baselines' },
    ka: { title: 'ჰაერის ტემპერატურა', subtitle: 'წლიური და სეზონური ტემპერატურის ტენდენციები ისტორიულ საბაზისო მაჩვენებლებთან შედარებით' }
};

const Temperature = () => {
    const { language = 'ka' } = useParams();
    const lang = language === 'ge' ? 'ka' : language;
    const t = HEADER_I18N[lang] || HEADER_I18N.ka;

    return (
        <div className="temperature-page">
            <div className="temperature-hero" style={{ backgroundImage: `url(${backgroundImg})` }}>
                <div className="temperature-hero-overlay" />
                <h1>{t.title}</h1>
                <h2>{t.subtitle}</h2>
            </div>
            <main className="temperature-layout">
                <AnnualTemperatureChart language={lang} />
                <TemperatureAnomalyBarChart language={lang} />
                <TemperatureMultiIndexLineChart language={lang} />
                <TemperatureMinimalTechChart language={lang} />
                <TemperatureTechnicalSchematic language={lang} />
                <TemperatureRadarComparisonChart language={lang} />
            </main>
        </div>
    );
};

export default Temperature;
