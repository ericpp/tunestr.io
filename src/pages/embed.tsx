import { StreamState } from "@/const";
import LiveVideoPlayer from "@/element/live-video-player";
import { useCurrentStreamFeed } from "@/hooks/current-stream-feed";
import { useStreamLink } from "@/hooks/stream-link";
import { extractStreamInfo } from "@/utils";
import { NostrLink } from "@snort/system";
import { Suspense } from "react";

export function EmbededPage() {
  const link = useStreamLink();
  if (link) {
    return <EmbededPagePlayer link={link} />;
  }
}

function EmbededPagePlayer({ link }: { link: NostrLink }) {
  const ev = useCurrentStreamFeed(link, true);
  const { title, image, status, stream, recording } = extractStreamInfo(ev);
  console.debug(ev);
  return (
    <div className="w-[100vw] h-[100vh]">
      <Suspense>
        <LiveVideoPlayer
          title={title}
          stream={status === StreamState.Live ? stream : recording}
          poster={image}
          status={status}
          className="h-[100vh]"
        />
      </Suspense>
    </div>
  );
}
