import ArenaCard from "@/components/ArenaCard"
import CreateArena from "@/components/CreateArena"
import RightSidebar from "@/components/RightSidebar"
import RiposteCard from "@/components/RiposteCard"
import { calculateScore, enrichRipostes } from "@/lib/score"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

type LeaderboardRow = {
  userId: string
  ripostes: number
  ko: number
  brutal: number
  smart: number
  score: number
}

export default async function HomePage() {
  const [{ data: arenas }, { data: ripostes }, { data: reactions }] = await Promise.all([
    supabaseAdmin.from("arenas").select("*").order("created_at", { ascending: false }).limit(20),
    supabaseAdmin.from("ripostes").select("*").order("created_at", { ascending: false }).limit(120),
    supabaseAdmin.from("reactions").select("*"),
  ])

  const arenaMap = new Map((arenas ?? []).map((arena) => [arena.id, arena]))
  const bestRipostes = enrichRipostes(ripostes, reactions).map((riposte) => ({
    ...riposte,
    arena_title: arenaMap.get(riposte.arena_id)?.title ?? "Untitled Arena",
  }))

  const topArenas = (arenas ?? [])
    .map((arena) => ({
      ...arena,
      riposteCount: (ripostes ?? []).filter((riposte) => riposte.arena_id === arena.id).length,
    }))
    .sort((a, b) => b.riposteCount - a.riposteCount)

  const map = new Map<string, LeaderboardRow>()

  for (const riposte of ripostes ?? []) {
    const userId = riposte.user_id ?? "anonymous"
    const related = (reactions ?? []).filter((reaction) => reaction.riposte_id === riposte.id)
    const ko = related.filter((reaction) => reaction.type === "KO").length
    const brutal = related.filter((reaction) => reaction.type === "BRUTAL").length
    const smart = related.filter((reaction) => reaction.type === "SMART").length

    const current = map.get(userId) ?? {
      userId,
      ripostes: 0,
      ko: 0,
      brutal: 0,
      smart: 0,
      score: 0,
    }

    current.ripostes += 1
    current.ko += ko
    current.brutal += brutal
    current.smart += smart
    current.score += calculateScore(ko, brutal, smart)

    map.set(userId, current)
  }

  const leaderboard = Array.from(map.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.ko - a.ko
  })

  return (
    <>
      <main className="center-column">
        <div className="timeline-header">
          <div className="timeline-title">Home</div>
          <div className="timeline-tabs">
            <a href="#trend-ripostes" className="timeline-tab-link">
              <div className="timeline-tab timeline-tab-active">Trend Ripostes</div>
            </a>
            <a href="#trend-arenas" className="timeline-tab-link">
              <div className="timeline-tab">Trend Arenas</div>
            </a>
          </div>
        </div>

        <div className="composer-card">
          <CreateArena />
        </div>

        <section className="section" id="trend-ripostes">
          <div className="section-title">Trend Ripostes</div>
          <div className="section-subtitle">
            今いちばん刺さっている返信。何に対する返信かも上で見える。
          </div>

          <div className="timeline-list">
            {bestRipostes.length === 0 ? (
              <div className="empty-box">まだRiposteがない。</div>
            ) : (
              bestRipostes.slice(0, 10).map((riposte) => (
                <RiposteCard key={riposte.id} riposte={riposte} />
              ))
            )}
          </div>
        </section>

        <section className="section" id="trend-arenas">
          <div className="section-title">Trend Arenas</div>
          <div className="section-subtitle">
            今動いているArena。埋め込みつきでそのまま観戦できる。
          </div>

          <div className="timeline-list">
            {topArenas.length === 0 ? (
              <div className="empty-box">まだArenaがない。</div>
            ) : (
              topArenas.slice(0, 10).map((arena) => (
                <ArenaCard
                  key={arena.id}
                  arena={arena}
                  riposteCount={arena.riposteCount}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <RightSidebar
        topRipostes={bestRipostes}
        topArenas={topArenas}
        leaderboard={leaderboard}
      />
    </>
  )
}