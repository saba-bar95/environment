// Waste
import { text as wasteText } from "./Texts/Waste/text";
import wasteBackground1 from "./Backgrounds/Waste/background1.jpg";
import wasteBackground2 from "./Backgrounds/Waste/background2.jpg";
// Emissions
import { text as emissionsText } from "./Texts/Emissions/text.js"; // Fixed typo in folder name
import emissionsBackground1 from "./Backgrounds/Emissions/background1.jpg";
import emissionsBackground2 from "./Backgrounds/Emissions/background2.jpg";
// SupplyAndLosses
import { text as lossesText } from "./Texts/SupplyAndLosses/text";
import lossesBackground1 from "./Backgrounds/SupplyAndLosses/background1.jpg"; // Fixed to use background1.jpg
import lossesBackground2 from "./Backgrounds/SupplyAndLosses/background2.jpg";
// Energy
import { text as energyText } from "./Texts/Energy/text";
import energyBackground1 from "./Backgrounds/Energy/background1.jpg"; // Fixed to use background1.jpg
import energyBackground2 from "./Backgrounds/Energy/background2.jpg";
// Transport
import { text as transportText } from "./Texts/Transport/text";
import transportBackground1 from "./Backgrounds/Transport/background1.jpg"; // Fixed to use background1.jpg
import transportBackground2 from "./Backgrounds/Transport/background2.jpg";
// Transport
import { text as reportsText } from "./Texts/Reports/text";
import reportsBackground1 from "./Backgrounds/Reports/background1.jpg"; // Fixed to use background1.jpg
import reportsBackground2 from "./Backgrounds/Reports/background2.jpg";

const Slides = [
  {
    text: wasteText,
    background1: wasteBackground1,
    background2: wasteBackground2,
    href: "waste",
  },
  {
    text: emissionsText,
    background1: emissionsBackground1,
    background2: emissionsBackground2,
    href: "climate/emissions",
  },
  {
    text: lossesText,
    background1: lossesBackground1,
    background2: lossesBackground2,
    href: "water/supplyandlosses",
  },
  {
    text: energyText,
    background1: energyBackground1,
    background2: energyBackground2,
    href: "energy",
  },
  {
    text: transportText,
    background1: transportBackground1,
    background2: transportBackground2,
    href: "transport",
  },
  {
    text: reportsText,
    background1: reportsBackground1,
    background2: reportsBackground2,
    href: "reports",
  },
];

export default Slides;
