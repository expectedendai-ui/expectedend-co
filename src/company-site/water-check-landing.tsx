import markup from "./water-check-landing.html?raw";
import "./water-check-landing.css";

/** Static, checked-in HTML from the approved Claude design. No user content is interpolated. */
export function WaterCheckLanding() {
  return <div className="waterLanding" dangerouslySetInnerHTML={{ __html: markup }} />;
}
