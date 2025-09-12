import "./Homepage.scss";
import Slider from "./Slider/Slider";
import Section from "./Sections/Section";

const Homepage = () => {
  return (
    <div className="homepage">
      <Slider />
      <Section />
    </div>
  );
};

export default Homepage;
