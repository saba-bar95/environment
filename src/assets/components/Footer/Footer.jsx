// import { useParams } from "react-router-dom";
// import Socials from "../Socials/Socials";
// import sections from "../../../../sections";
// import text from "./text";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   let { language } = useParams();

//   const openTermsOfDataUse = () => {
//     const url = `https://www.geostat.ge/${
//       language === "ge" ? "ka" : "en"
//     }/page/monacemta-gamoyenebis-pirobebi`;
//     window.open(url, "_blank");
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//       easing: "ease-in-out",
//     });
//   };

//   return (
//     <footer>
//       <div className="footer-container">
//         <div className="container">
//           <h1>{text[language].header1}</h1>
//           <div className="paras">
//             <p>{text[language].para11}</p>
//             <a href="tel:+995322367210">
//               <p>{text[language].para12}</p>
//             </a>
//             <a href={`mailto:${text[language].para13}`}>
//               <p>{text[language].para13}</p>{" "}
//             </a>
//             <p>{text[language].para14}</p>
//           </div>
//           <div className="socials">
//             <h1>{text[language].para15}</h1>
//             <Socials />
//           </div>
//         </div>
//         <div className="container">
//           <h1>{text[language].header2}</h1>
//           <div className="sections-container">
//             <ul>
//               {sections.map((section, i) => {
//                 return (
//                   <Link to={section.href} key={i}>
//                     <li
//                       onClick={() => {
//                         scrollToTop();
//                       }}>
//                       <p>{section[`name_${language}`]}</p>
//                     </li>
//                   </Link>
//                 );
//               })}
//             </ul>
//           </div>
//         </div>
//         <div className="container">
//           <h1 onClick={openTermsOfDataUse} className="terms">
//             {text[language].header3}
//           </h1>
//         </div>
//       </div>
//       <div className="border-container"></div>
//       <div className="rights">
//         <h1>{text[language].header4}</h1>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
