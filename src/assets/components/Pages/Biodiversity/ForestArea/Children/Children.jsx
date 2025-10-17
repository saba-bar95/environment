// Protected Areas
import { text as protectedAreasText } from "./Texts/ForestResources/text";
import protectedAreasBackground from "./Backgrounds/ForestResources/background.jpg";
// ForestArea
import { text as timberText } from "./Texts/Timber/text";
import timberBackground from "./Backgrounds/Timber/background.jpg";
// Forest and Field Fires
import { text as inventorizationText } from "./Texts/Inventorization/text";
import inventorizationBackground from "./Backgrounds/Inventorization/background.jpg";

const Children = [
  {
    text: protectedAreasText,
    background: protectedAreasBackground,
    href: "biodiversity/forestarea/forestresources",
  },
  {
    text: timberText,
    background: timberBackground,
    link_ge: "https://ex-trade.geostat.ge/",
    link_en: "https://ex-trade.geostat.ge/",
  },
  {
    text: inventorizationText,
    background: inventorizationBackground,
    link_ge:
      "https://app.powerbi.com/view?r=eyJrIjoiNGM3M2ZmOTktYmY1ZS00MTMzLThlOWMtOTA3YzBmNzkwZjE3IiwidCI6ImI5OTlhZTA2LTc3OGItNGEwMi1hMWNiLTBiNWU2ZTg1N2I2ZCIsImMiOjEwfQ%3D%3D",
    link_en:
      "https://app.powerbi.com/view?r=eyJrIjoiMmI2NWIyYjMtYWJmNi00NTIwLTkxOWItNTY2ZGI2N2QxYmViIiwidCI6ImI5OTlhZTA2LTc3OGItNGEwMi1hMWNiLTBiNWU2ZTg1N2I2ZCIsImMiOjEwfQ%3D%3D",
  },
];

export default Children;
