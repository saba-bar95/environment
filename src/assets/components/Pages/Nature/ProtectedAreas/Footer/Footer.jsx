import "./Footer.scss";
import backgroundImg from "./Background/background.jpg";
import { useParams } from "react-router-dom";

const Footer = () => {
  const { language } = useParams();

  return (
    <div
      className="nature-footer"
      style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="text-wrapper">
        <h1>
          {language === "en"
            ? "About protected areas"
            : "დაცული ტერიტორიების შესახებ"}
        </h1>
        <p>
          {language === "en"
            ? "Protected areas are regions designated for the conservation of nature and biodiversity, to protect vital ecosystems, landscapes and endangered species."
            : "დაცული ტერიტორიები არის რეგიონები, რომლებიც განკუთვნილია ბუნებისა და ბიომრავალფეროვნების კონსერვაციისთვის, სასიცოცხლოდ მნიშვნელოვანი ეკოსისტემების, ლანდშაფტებისა და გადაშენების საფრთხის წინაშე მყოფი სახეობების დასაცავად."}
        </p>
        <p>
          {language === "en"
            ? "In Georgia, protected areas include national parks, state reserves, nature reserves, natural monuments, protected landscapes and multiple-use areas, which are managed in accordance with international standards."
            : "საქართველოში დაცული ტერიტორიები მოიცავს ეროვნულ პარკებს, სახელმწიფო ნაკრძალებს, აღკვეთილებსა, ბუნების ძეგლებს, დაცულ ლანდშაფტებს და მრავალმხრივი გამოყენების ტერიტორიებს, რომლებიც იმართება საერთაშორისო სტანდარტების შესაბამისად."}
        </p>
      </div>
    </div>
  );
};

export default Footer;
