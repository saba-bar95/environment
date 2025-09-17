// Majors
import { text as majorsText } from "./Texts/Majors/text";
import forestAndFieldFiresBackground from "./Backgrounds/Majors/background.jpg";
// Protection
import { text as protectionText } from "./Texts/Protection/text";
import protectionBackground from "./Backgrounds/protection/background.jpg";
// Supply And Losses
import { text as supplyAndLossesText } from "./Texts/SupplyAndLosses/text";
import supplyAndLossesBackground from "./Backgrounds/SupplyAndLosses/background.jpg";

const Children = [
  {
    text: majorsText,
    background: forestAndFieldFiresBackground,
    href: "water/majors",
  },
  {
    text: protectionText,
    background: protectionBackground,
    href: "water/protection",
  },
  {
    text: supplyAndLossesText,
    background: supplyAndLossesBackground,
    href: "water/supplyAndLosses",
  },
];

export default Children;
