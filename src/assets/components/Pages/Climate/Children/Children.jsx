// Disasters
import { text as disastersText } from "./Texts/Disasters/text";
import disastersBackground from "./Backgrounds/Disasters/background.jpg";
// Temperature
import { text as temperatureText } from "./Texts/Temperature/text";
import temperatureBackground from "./Backgrounds/Temperature/background.jpg";
// Precipitation
import { text as precipitationText } from "./Texts/Precipitation/text";
import precipitationBackground from "./Backgrounds/Precipitation/background.jpg";
// Emissions
import { text as emissionsText } from "./Texts/Emissions/text";
import emissionsBackground from "./Backgrounds/Emissions/background.jpg";

const Children = [
  {
    text: disastersText,
    background: disastersBackground,
    href: "climate/disasters",
  },
  {
    text: temperatureText,
    background: temperatureBackground,
    href: "climate/temperature",
  },
  {
    text: precipitationText,
    background: precipitationBackground,
    href: "climate/precipitation",
  },
  {
    text: emissionsText,
    background: emissionsBackground,
    href: "climate/emissions",
  },
];

export default Children;
