import Link from "next/link"
import ShareButton from "@/components/ShareButton"
import type { ArenaRow } from "@/lib/types"

type Props = {
  arena: ArenaRow
  riposteCount?: number
}

export default function ArenaCard({ arena, riposteCount = 0 }: Props) {
  const embedUrl = `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(arena.source_url)}&theme=dark`

  return (
    <article className="feed-card">
      <div className="feed-label">Arena</div>
      <Link href={`/arena/${arena.id}`}>
        <h3 className="feed-title-sm">{arena.title || "Untitled Arena"}</h3>
      </Link>

      <p className="feed-text">
        神返信・切り返し・レスバを集める闘技場。元ポストを起点にRiposteで勝負。
      </p>

      <div className="feed-embed">
        <iframe
          src={embedUrl}
          width="100%"
          height="420"
          frameBorder="0"
          scrolling="no"
          title={`arena-${arena.id}`}
        />
      </div>

      <div className="feed-actions">
        <span className="metric-pill">Ripostes {riposteCount}</span>
        <span className="metric-pill">{new Date(arena.created_at).toLocaleDateString("ja-JP")}</span>
        <Link href={`/arena/${arena.id}`} className="button button-secondary">
          Open Arena
        </Link>
        <ShareButton
          url={`https://riposte.jp/arena/${arena.id}`}
          text="このレスバArena行き"
        />
      </div>
    </article>
  )
}