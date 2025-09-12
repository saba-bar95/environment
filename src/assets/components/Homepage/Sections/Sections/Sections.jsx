// Air
import { text as airText } from "./Texts/Air/text";
import airBackground from "./Backgrounds/Air/background.jpg";
// Climate
import { text as climateText } from "./Texts/Climate/text";
import climateBackground from "./Backgrounds/Climate/background.jpg";
// Water
import { text as waterText } from "./Texts/Water/text";
import waterBackground from "./Backgrounds/Water/background.jpg";
// Nature
import { text as natureText } from "./Texts/Nature/text";
import natureBackground from "./Backgrounds/Nature/background.jpg";
// Transport and Energy
import { text as transportAndEnergyText } from "./Texts/TransportAndEnergy/text";
import transportAndEnergyBackground from "./Backgrounds/TransportAndEnergy/background.jpg";
// Reports
import { text as reportsText } from "./Texts/Reports/text";
import reportsBackground from "./Backgrounds/Reports/background.jpg";
// Waste
import { text as wasteText } from "./Texts/Waste/text";
import wasteBackground from "./Backgrounds/Waste/background.jpg";
// Others
import { text as otherText } from "./Texts/Other/text";
import otherBackground from "./Backgrounds/Other/background.jpg";

const Sections = [
  {
    text: airText,
    background: airBackground,
    href: "air",
  },
  {
    text: natureText,
    background: natureBackground,
    href: "nature",
  },
  {
    text: waterText,
    background: waterBackground,
    href: "water",
  },
  {
    text: climateText,
    background: climateBackground,
    href: "climate",
  },
  {
    text: transportAndEnergyText,
    background: transportAndEnergyBackground,
    href: "transportandenergy",
  },
  {
    text: reportsText,
    background: reportsBackground,
    href: "reports",
  },
  {
    text: wasteText,
    background: wasteBackground,
    href: "waste",
  },
  {
    text: otherText,
    background: otherBackground,
    href: "other",
  },
];

export default Sections;
