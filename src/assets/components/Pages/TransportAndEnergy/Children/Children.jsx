// Protected Transport
import { text as transportAreasText } from "./Texts/Transport/text";
import transportAreasBackground from "./Backgrounds/Transport/background.jpg";
// Energy
import { text as energyText } from "./Texts/Energy/text";
import energyBackground from "./Backgrounds/Energy/background.jpg";

const Children = [
  {
    text: transportAreasText,
    background: transportAreasBackground,
    href: "transport",
  },
  {
    text: energyText,
    background: energyBackground,
    href: "energy",
  },
];

export default Children;
