import "./water-check-app.css";

const screens = [
  { file: "appstore-01", alt: "The Water Check personal daily water estimate on an iPhone" },
  { file: "appstore-02", alt: "The Water Check daily log with drinks and food on an iPhone" },
  { file: "appstore-03", alt: "The Water Check Home Screen widget settings on an iPhone" },
  { file: "appstore-04", alt: "The Water Check wellness guide and P-Meter on an iPhone" },
  { file: "appstore-05", alt: "The Water Check monthly water calendar on an iPhone" },
] as const;

export function WaterCheckApp() {
  return (
    <section id="the-app" className="waterApp" aria-labelledby="water-app-title">
      <div className="waterAppInner">
        <div className="waterAppIntro">
          <p className="waterAppEyebrow">The app</p>
          <h2 id="water-app-title">Your water, day by day.</h2>
          <p>
            Start with a personal estimate, then log drinks and water-rich food as your day unfolds.
            See your progress in the app, on your Home Screen, and across the month.
          </p>
          <div className="waterAppActions">
            <span className="waterAppComingSoon">
              Coming soon to the App Store
            </span>
            <a href="#calculator">Try the free calculator</a>
          </div>
          <p className="waterAppCaveat">
            The calculator works here without an account. App screenshots show a preview build; features and availability may change before release.
          </p>
        </div>
        <div className="waterAppScreens">
          {screens.map((screen, index) => (
            <figure key={screen.file}>
              <img
                src={`/media/water-check/${screen.file}.webp`}
                alt={screen.alt}
                width="660"
                height="1434"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{["Your number", "Today's log", "Widgets", "Wellness", "Calendar"][index]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
