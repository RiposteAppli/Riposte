import type { Metadata } from "next"
import RiposteCard from "@/components/RiposteCard"
import RiposteForm from "@/components/RiposteForm"
import ShareButton from "@/components/ShareButton"
import { enrichRipostes } from "@/lib/score"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const { data: arena } = await supabaseAdmin.from("arenas").select("*").eq("id", id).maybeSingle()

  const title = arena?.title ? `${arena.title} | Riposte` : "Arena | Riposte"

  return {
    title,
    openGraph: {
      title,
      description: "最高の返信に最高の名誉を。",
      images: ["/api/og"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "最高の返信に最高の名誉を。",
      images: ["/api/og"],
    },
  }
}

export default async function ArenaPage({ params }: Props) {
  const { id } = await params

  const [{ data: arena }, { data: ripostes }, { data: reactions }] = await Promise.all([
    supabaseAdmin.from("arenas").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin.from("ripostes").select("*").eq("arena_id", id).order("created_at", { ascending: false }),
    supabaseAdmin.from("reactions").select("*"),
  ])

  if (!arena) {
    return (
      <main className="page">
        <div className="shell">
          <div className="empty">Arena not found.</div>
        </div>
      </main>
    )
  }

  const enriched = enrichRipostes(ripostes, reactions)

  return (
    <main className="page">
      <div className="shell split">
        <div className="stack">
          <section className="card">
            <div className="card-label">Original Post</div>
            <h1 className="card-title">{arena.title || "Untitled Arena"}</h1>
            <p className="card-subtitle">
              元ポストを起点に、ここで返信の質だけが評価される。
            </p>

            <div className="actions-row top-space">
              <a
                className="button button-secondary"
                href={arena.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Open Original
              </a>

              <ShareButton
                url={`https://riposte.jp/arena/${arena.id}`}
                text="このレスバArena行き"
              />
            </div>
          </section>

          <section className="panel create-panel">
            <h2 className="create-title">Top Ripostes</h2>
            <p className="muted">KO / Brutal / Smartの評価で上位表示。</p>

            <div className="list top-space">
              {enriched.length === 0 ? (
                <div className="empty">まだRiposteがない。</div>
              ) : (
                enriched.map((riposte) => <RiposteCard key={riposte.id} riposte={riposte} />)
              )}
            </div>
          </section>
        </div>

        <div className="stack">
          <RiposteForm arenaId={arena.id} />

          <section className="panel create-panel">
            <h3 className="create-title">Arena Stats</h3>
            <div className="stats-grid top-space">
              <div className="stat">
                <p className="stat-value">{enriched.length}</p>
                <div className="stat-label">Ripostes</div>
              </div>
              <div className="stat">
                <p className="stat-value">{enriched.reduce((sum, item) => sum + item.ko, 0)}</p>
                <div className="stat-label">KOs</div>
              </div>
              <div className="stat">
                <p className="stat-value">{enriched[0]?.score ?? 0}</p>
                <div className="stat-label">Top Score</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
