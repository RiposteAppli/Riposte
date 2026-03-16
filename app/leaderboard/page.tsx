import RightSidebar from "@/components/RightSidebar"
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

export default async function LeaderboardPage() {
  const [{ data: arenas }, { data: ripostes }, { data: reactions }] = await Promise.all([
    supabaseAdmin.from("arenas").select("*").order("created_at", { ascending: false }).limit(50),
    supabaseAdmin.from("ripostes").select("*").order("created_at", { ascending: false }).limit(300),
    supabaseAdmin.from("reactions").select("*"),
  ])

  const topArenas = (arenas ?? [])
    .map((arena) => ({
      ...arena,
      riposteCount: (ripostes ?? []).filter((riposte) => riposte.arena_id === arena.id).length,
    }))
    .sort((a, b) => b.riposteCount - a.riposteCount)

  const arenaMap = new Map((arenas ?? []).map((arena) => [arena.id, arena]))
  const topRipostes = enrichRipostes(ripostes, reactions).map((riposte) => ({
    ...riposte,
    arena_title: arenaMap.get(riposte.arena_id)?.title ?? "Untitled Arena",
  }))

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
          <div className="timeline-title">Leaderboard</div>
        </div>

        <div className="page-panel">
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-subtitle">
            返信の質だけで並ぶ匿名ランキング。
          </p>
        </div>

        <div className="timeline-list">
          {leaderboard.length === 0 ? (
            <div className="empty-box">まだランキング対象がない。</div>
          ) : (
            leaderboard.map((row, index) => (
              <article key={row.userId} className="feed-card">
                <div className="feed-label">Rank</div>
                <div className="row-between" style={{ alignItems: "flex-start" }}>
                  <div>
                    <h3 className="feed-title-sm" style={{ marginBottom: 6 }}>
                      #{index + 1} Anon {row.userId.slice(0, 8)}
                    </h3>
                    <p className="feed-text">
                      Ripostes {row.ripostes} ・ KO {row.ko} ・ Brutal {row.brutal} ・ Smart {row.smart}
                    </p>
                  </div>

                  <div className="metric-pill" style={{ color: "#fff", borderColor: "#4b1414", background: "#170909" }}>
                    Score {row.score}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <RightSidebar
        topRipostes={topRipostes}
        topArenas={topArenas}
        leaderboard={leaderboard}
      />
    </>
  )
}