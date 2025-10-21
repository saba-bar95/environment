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
    link_ge: "https://mepa.gov.ge/ge/Page/NFI/",
    link_en: "https://mepa.gov.ge/en/Page/NFI/",
  },
];

export default Children;
