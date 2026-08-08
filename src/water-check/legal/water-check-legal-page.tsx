import type * as React from "react";
import type { WaterCheckLegalContent } from "./water-check-legal-content";

type WaterCheckLegalPageProps = {
  content: WaterCheckLegalContent;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function WaterCheckLegalPage({ content, onNavigate }: WaterCheckLegalPageProps) {
  return (
    <main style={{ width: "min(58rem, 100%)", textAlign: "left" }} aria-label={`${content.footerLabel} information`}>
      <article aria-label={content.title}>
        <header style={{ paddingBottom: "clamp(2rem, 6vw, 4rem)", borderBottom: "1px solid rgba(16, 39, 59, 0.16)" }}>
          <p style={{ maxWidth: "none", margin: "0 0 1rem" }}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p style={{ maxWidth: "46rem", margin: "1.5rem 0 0", fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>{content.intro}</p>
          <p style={{ maxWidth: "none", margin: "1rem 0 0", color: "#176d83", fontWeight: 700 }}>
            Effective date: {content.effectiveDateLabel}
          </p>
        </header>

        <div style={{ display: "grid", gap: "clamp(2rem, 5vw, 3.5rem)", padding: "clamp(2rem, 6vw, 4rem) 0" }}>
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
                  fontWeight: 400,
                }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} style={{ maxWidth: "48rem", margin: "1rem 0 0" }}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <aside
          aria-label="Return to product page"
          style={{
            padding: "1.25rem",
            border: "1px solid rgba(16, 39, 59, 0.16)",
            borderRadius: "1rem",
            background: "rgba(255, 255, 255, 0.46)",
          }}
        >
          <a
            href="/thewatercheck"
            onClick={onNavigate}
            style={{ fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "0.25em" }}
          >
            Return to The Water Check
          </a>
        </aside>
      </article>
    </main>
  );
}
