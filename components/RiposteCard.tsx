import Link from "next/link"
import ReactionButtons from "@/components/ReactionButtons"
import ShareButton from "@/components/ShareButton"

type Props = {
  riposte: {
    id: string
    content: string
    score: number
    ko: number
    brutal: number
    smart: number
    arena_id: string
    arena_title?: string | null
  }
}

export default function RiposteCard({ riposte }: Props) {
  return (
    <article className="feed-card">
      <Link href={`/arena/${riposte.arena_id}`} className="riposte-arena-mini">
        <span>Arena</span>
        <span>{riposte.arena_title || "Untitled Arena"}</span>
      </Link>

      <div className="row-between" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="feed-text" style={{ color: "#ffffff", fontSize: 18 }}>
            {riposte.content}
          </p>
        </div>

        <div className="metric-pill" style={{ color: "#fff", borderColor: "#4b1414", background: "#170909" }}>
          Score {riposte.score}
        </div>
      </div>

      <div className="feed-actions">
        <ReactionButtons
          riposteId={riposte.id}
          ko={riposte.ko}
          brutal={riposte.brutal}
          smart={riposte.smart}
        />

        <Link href={`/riposte/${riposte.id}`} className="button button-secondary">
          Open
        </Link>

        <ShareButton
          url={`https://riposte.jp/riposte/${riposte.id}`}
          text="Nice riposte."
        />
      </div>
    </article>
  )
}