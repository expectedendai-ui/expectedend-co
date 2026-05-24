import * as React from "react";
import manifest from "~/src/artworks/manifest.json";
import { BugSwarm, type BugSwarmHandle } from "~/src/bug-swarm";
import { DashboardOverlay } from "~/src/dashboard";
import { Frame } from "~/src/frame";
import { InfiniteCanvas } from "~/src/infinite-canvas";
import type { MediaItem } from "~/src/infinite-canvas/types";
import { PageLoader } from "~/src/loader";

export function App() {
  const [media] = React.useState<MediaItem[]>(manifest);
  const [textureProgress, setTextureProgress] = React.useState(0);
  const [dashboardActive, setDashboardActive] = React.useState(true);
  const bugSwarmRef = React.useRef<BugSwarmHandle>(null);

  if (!media.length) {
    return <PageLoader progress={0} />;
  }

  return (
    <>
      <Frame />
      <PageLoader progress={textureProgress} />
      <InfiniteCanvas media={media} onTextureProgress={setTextureProgress} />
      <DashboardOverlay
        active={dashboardActive}
        onSpawnBugs={(species, count) => bugSwarmRef.current?.spawn(species, count)}
        onEnterCanvas={() => {
          bugSwarmRef.current?.clear();
          setDashboardActive(false);
        }}
      />
      <BugSwarm ref={bugSwarmRef} />
    </>
  );
}
