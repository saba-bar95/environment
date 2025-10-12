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
    href: "nature/forestarea/forestresources",
  },
  {
    text: timberText,
    background: timberBackground,
    href: "nature/forestarea/timber",
  },
  {
    text: inventorizationText,
    background: inventorizationBackground,
    href: "nature/forestarea/inventorization",
  },
];

export default Children;
