/////// Climate Svgs
import Disaster from "./Svgs/Climate/Disaster";
import Temperature from "./Svgs/Climate/Temperature";
import Precipitation from "./Svgs/Climate/Precipitation";
import Emissions from "./Svgs/Climate/Emissions";
/////// Water Svgs
import Major from "./Svgs/Water/Major";
import Protection from "./Svgs/Water/Protection";
import SupplyAndLosses from "./Svgs/Water/SupplyAndLosses";
// import Trace from "./Svgs/Water/Trace";
////// Biodiversity Svgs
import ProtectedAreas from "./Svgs/Biodiversity/ProtectedAreas";
import ForestArea from "./Svgs/Biodiversity/ForestArea";
import ForestAndFieldFires from "./Svgs/Biodiversity/ForestAndFieldFires";

const sections = [
  {
    name_ge: "მთავარი",
    name_en: "Main",
    id: 1,
    href: "",
  },
  {
    name_ge: "ჰაერი",
    name_en: "Air",
    id: 2,
    href: "air",
  },
  {
    name_ge: "ბიომრავალფეროვნება",
    name_en: "Biodiversity",
    id: 5,
    href: "biodiversity",
    links: [
      {
        header_ge: "დაცული ტერიტორიები",
        header_en: "Protected Areas",
        link: "protectedareas",
        svg: ProtectedAreas,
      },
      {
        header_ge: "ტყე",
        header_en: "Forest",
        link: "forestarea",
        svg: ForestArea,
      },
      {
        header_ge: "ტყისა და ველის ხანძრები",
        header_en: "Forest and Field Fires",
        link: "forestandfieldfires",
        svg: ForestAndFieldFires,
      },
    ],
  },
  {
    name_ge: "წყალი",
    name_en: "Water",
    id: 4,
    href: "water",
    links: [
      {
        header_ge: "ძირითადი მდინარეები, ტბები და წყალსაცავები",
        header_en: "Major Rivers, Lakes, and Reservoirs",
        link: "majors",
        svg: Major,
      },
      {
        header_ge:
          "წყლის რესურსების დაცვისა და გამოყენების ძირითადი მაჩვენებლები",
        header_en: "Key indicators of water resource protection and use",
        link: "protection",
        svg: Protection,
      },
      {
        header_ge: "წყალმომარაგება და დანაკარგები",
        header_en: "Water Supply and Losses",
        link: "supplyandlosses",
        svg: SupplyAndLosses,
      },
      // {
      //   header_ge: "წყლის მოხმარების კვალი",
      //   header_en: "Water Trace",
      //   link: "trace",
      //   svg: Trace,
      // },
    ],
  },
  {
    name_ge: "კლიმატი",
    name_en: "Climate",
    id: 3,
    href: "climate",
    links: [
      {
        header_ge: "სტიქიური მოვლენები",
        header_en: "Natural Disasters",
        link: "disasters",
        svg: Disaster,
      },
      {
        header_ge: "ჰაერის ტემპერატურა",
        header_en: "Air Temperature",
        link: "temperature",
        svg: Temperature,
      },
      {
        header_ge: "ატმოსფერული ნალექები",
        header_en: "Precipitation",
        link: "precipitation",
        svg: Precipitation,
      },
      {
        header_ge: "სათბურის აირების გაფრქვევები",
        header_en: "Greenhouse Gas Emissions",
        link: "emissions",
        svg: Emissions,
      },
    ],
  },
  {
    name_ge: "ტრანსპორტი",
    name_en: "Transport",
    id: 8,
    href: "transport",
  },

  {
    name_ge: "ენერგეტიკა",
    name_en: "Energy",
    id: 7,
    href: "energy",
  },
  {
    name_ge: "გარემოს ეკონომიკური ანგარიშები",
    name_en: "Environmental Economic Reports",
    id: 6,
    href: "reports",
  },
  {
    name_ge: "ნარჩენები",
    name_en: "Waste",
    id: 9,
    href: "waste",
  },
  {
    name_ge: "სხვა",
    name_en: "Other",
    id: 10,
    href: "other",
  },
];

export default sections;
