import * as React from "react";
import { ContactForm } from "./contact-form";
import { GoldenEggButton } from "./golden-egg-button";
import styles from "./style.module.css";
import { VerseDialog } from "./verse-dialog";

type AboutPageProps = {
  onOpenArtWorld: () => void;
};

export function AboutPage({ onOpenArtWorld }: AboutPageProps) {
  const [showVerse, setShowVerse] = React.useState(false);

  return (
    <main className={styles.aboutMain}>
      <section className={styles.aboutLayout}>
        <p className={styles.kicker}>Founder story</p>
        <h1>Hi, my name is Denzel Rigaud.</h1>
        <div className={styles.aboutCopy}>
          <p className={styles.aboutLead}>I am a jack of all trades. I take an idea, learn what it needs, and stay with it until people can use it.</p>
          <p>Technology has been part of my life since fifth grade. School had frustrated me from an early age. I failed second grade while facing a language barrier, and I did not believe that failure should define me. I became curious about the systems around me and started testing how they worked.</p>
          <p>That curiosity carried me into coding, automation, machine learning, online communities, digital growth, and the underground side of the internet. I learned how much technology could do, sometimes in ways I would approach with better judgment today.</p>
        </div>
      </section>

      <div className={styles.aboutStory}>
        <section className={styles.storyChapter} aria-labelledby="family-title">
          <div className={styles.storyHeading}>
            <p className={styles.kicker}>The people who taught me</p>
            <h2 id="family-title">My first web wizard.</h2>
          </div>
          <div className={styles.storyCopy}>
            <p>My father and brother were the smartest people I knew. They taught me to understand what technology could become before I had the words to explain it. My father was a web wizard, and I believed there was nothing he could not figure out.</p>
            <p>In 2021, I moved to Florida and got to live with my father for the first time. Six months later, he died. I closed the door on technology because every skill reminded me of him.</p>
            <p>My father had been Muslim for much of his life. I followed Islam in part because I wanted to be like him. Before he died, he gave his life to Christ. His decision stayed with me long after I put my own tools away.</p>
          </div>
        </section>

        <section className={styles.storyChapter} aria-labelledby="return-title">
          <div className={styles.storyHeading}>
            <p className={styles.kicker}>The return</p>
            <h2 id="return-title">I opened the door again.</h2>
          </div>
          <div className={styles.storyCopy}>
            <p>I spent years avoiding the part of myself that reminded me of my father. I still touched technology from time to time, but grief made it hard to stay. I tried to fill that loss in ways that pulled me farther from the person I wanted to become.</p>
            <p>In January 2026, I knew I needed to change. On February 25, 2026, I gave my life to Christ.</p>
            <p>MyBibleLens came from that decision. I did not have a complete plan. I began building and kept moving. The work let me open the door I had closed after my father died. I brought back The Water Check and started picking up dreams I had carried since childhood.</p>
          </div>
        </section>

        <section className={styles.missionStory} id="mission" aria-labelledby="about-mission-title">
          <div>
            <p className={styles.kicker}>Our mission</p>
            <h2 id="about-mission-title">Technology should help you return to your life.</h2>
          </div>
          <div className={styles.missionCopy}>
            <p>I believe technology trains the way we seek attention and reward. Constant comparison, dating apps, and polished versions of other people’s lives can make real relationships and quiet moments feel less valuable. Children enter those systems before they understand the pressure behind them.</p>
            <p>Expected End builds a better use for the screen. I want children and adults to open technology to learn, create, work, find a safe place, or move closer to God. Then I want them to close it and return to family, friends, and the life in front of them.</p>
            <p>My path has taken me through different faiths, identities, and ways of seeing the world. It taught me to lead with peace, love, kindness, and the humility to listen. I cannot choose another person’s character. I can build tools that help them pause, learn, and choose what comes next.</p>
            <p className={styles.missionLine}>Our mission is to bring people closer to God through productive, useful, and joyful technology that leaves room for real life.</p>
          </div>
        </section>

        <section className={styles.projectOrigins} aria-labelledby="projects-origin-title">
          <div className={styles.storyHeading}>
            <p className={styles.kicker}>The projects</p>
            <h2 id="projects-origin-title">Two ideas, one purpose.</h2>
          </div>
          <div className={styles.originGrid}>
            <article>
              <span>01</span>
              <h3>MyBibleLens</h3>
              <p>MyBibleLens is the first product I built after giving my life to Christ. It helps people make Scripture personal, visual, and easier to carry into daily life.</p>
              <a href="https://mybiblelens.us/" target="_blank" rel="noreferrer">Visit MyBibleLens <span aria-hidden="true">↗</span></a>
            </article>
            <article>
              <span>02</span>
              <h3>The Water Check</h3>
              <p>The Water Check brought me out from behind the screen. I revived it to speak about attention, relationships, self-worth, and the lives we perform online.</p>
              <a href="https://www.instagram.com/thewatercheck/" target="_blank" rel="noreferrer">Visit Instagram <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        </section>

        <section className={styles.pressSection} id="press" aria-labelledby="press-title">
          <div>
            <p className={styles.kicker}>Press</p>
            <h2 id="press-title">Tell the story with us.</h2>
          </div>
          <div>
            <p>Expected End welcomes conversations about faith-centered technology, digital well-being, founder grief, MyBibleLens, The Water Check, and products that return time to real life.</p>
            <a href="#contact">Start a press inquiry <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className={styles.expectedEnding} aria-labelledby="ending-title">
          <p className={styles.kicker}>Why Expected End?</p>
          <h2 id="ending-title">An expected ending.</h2>
          <p>I named Expected End after Jeremiah 29:11. I carry the name as a reminder that God can use the delayed, buried, and broken parts of my life and lead me toward peace and purpose.</p>
          <p>Everything I build under this company points toward the same mission: bring people closer to God and help them use technology to live, create, love, and serve with intention. That is the expected ending I am working toward.</p>
          <button type="button" aria-haspopup="dialog" onClick={() => setShowVerse(true)}>Jeremiah 29:11 <span aria-hidden="true">✦</span></button>
        </section>
      </div>

      <ContactForm />
      <GoldenEggButton onActivate={onOpenArtWorld} />
      {showVerse && <VerseDialog onClose={() => setShowVerse(false)} />}
    </main>
  );
}
