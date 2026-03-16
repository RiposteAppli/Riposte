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

export default async function BestPage() {
  const [{ data: arenas }, { data: ripostes }, { data: reactions }] = await Promise.all([
    supabaseAdmin.from("arenas").select("*").order("created_at", { ascending: false }).limit(50),
    supabaseAdmin.from("ripostes").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("reactions").select("*"),
  ])

  const arenaMap = new Map((arenas ?? []).map((arena) => [arena.id, arena]))
  const ranked = enrichRipostes(ripostes, reactions).map((riposte) => ({
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

  const leaderboard = Array.from(map.values()).sort((a, b) => b.score - a.score)

  return (
    <>
      <main className="center-column">
        <div className="timeline-header">
          <div className="timeline-title">Best Ripostes</div>
        </div>

        <div className="page-panel">
          <h1 className="page-title">Best Ripostes</h1>
          <p className="page-subtitle">
            評価スコア順に並ぶ返信一覧。
          </p>
        </div>

        <div className="timeline-list">
          {ranked.length === 0 ? (
            <div className="empty-box">まだRiposteがない。</div>
          ) : (
            ranked.map((riposte) => <RiposteCard key={riposte.id} riposte={riposte} />)
          )}
        </div>
      </main>

      <RightSidebar
        topRipostes={ranked}
        topArenas={topArenas}
        leaderboard={leaderboard}
      />
    </>
  )
}