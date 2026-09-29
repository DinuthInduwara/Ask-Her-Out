import PropTypes from "prop-types";
import { Bird } from "./MoonGarden";

function Cloud({ className }) {
  return (
    <div className={`day-cloud ${className}`}>
      <span /><span /><span />
    </div>
  );
}

Cloud.propTypes = { className: PropTypes.string.isRequired };

export function DaySky() {
  return (
    <div className="day-sky" aria-hidden="true">
      <div className="day-sun" />
      <div className="day-moon" />
      <Cloud className="day-cloud--one" />
      <Cloud className="day-cloud--two" />
      <Cloud className="day-cloud--three" />
      <div className="day-bird day-bird--one"><Bird /></div>
      <div className="day-bird day-bird--two"><Bird /></div>
      <div className="day-bird day-bird--three"><Bird /></div>
    </div>
  );
}
