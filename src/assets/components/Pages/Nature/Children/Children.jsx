// Protected Areas
import { text as protectedAreasText } from "./Texts/ProtectedAreas/text";
import protectedAreasBackground from "./Backgrounds/ProtectedAreas/background.jpg";
// ForestArea
import { text as forestArea } from "./Texts/ForestArea/text";
import forestBackground from "./Backgrounds/ForestArea/background.jpg";
// Forest and Field Fires
import { text as forestAndFieldFiresText } from "./Texts/ForestAndFieldFires/text";
import forestAndFieldFiresBackground from "./Backgrounds/ForestAndFieldFires/background.jpg";

const Children = [
  {
    text: protectedAreasText,
    background: protectedAreasBackground,
    href: "nature/protectedareas",
  },
  {
    text: forestArea,
    background: forestBackground,
    href: "nature/forestarea",
  },
  {
    text: forestAndFieldFiresText,
    background: forestAndFieldFiresBackground,
    href: "nature/forestandfieldfires",
  },
];

export default Children;
