import RightSidebar from "@/components/RightSidebar"
import RiposteCard from "@/components/RiposteCard"
import { calculateScore, enrichRipostes } from "@/lib/score"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

type Props = {
  params: Promise<{ id: string }>
}

type LeaderboardRow = {
  userId: string
  ripostes: number
  ko: number
  brutal: number
  smart: number
  score: number
}

export default async function RipostePage({ params }: Props) {
  const { id } = await params

  const [{ data: arenas }, { data: ripostes }, { data: reactions }, { data: current }] = await Promise.all([
    supabaseAdmin.from("arenas").select("*").order("created_at", { ascending: false }).limit(50),
    supabaseAdmin.from("ripostes").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("reactions").select("*"),
    supabaseAdmin.from("ripostes").select("*").eq("id", id).maybeSingle(),
  ])

  const arenaMap = new Map((arenas ?? []).map((arena) => [arena.id, arena]))
  const ranked = enrichRipostes(ripostes, reactions).map((riposte) => ({
    ...riposte,
    arena_title: arenaMap.get(riposte.arena_id)?.title ?? "Untitled Arena",
  }))

  const target = ranked.find((riposte) => riposte.id === id)

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

    const currentUser = map.get(userId) ?? {
      userId,
      ripostes: 0,
      ko: 0,
      brutal: 0,
      smart: 0,
      score: 0,
    }

    currentUser.ripostes += 1
    currentUser.ko += ko
    currentUser.brutal += brutal
    currentUser.smart += smart
    currentUser.score += calculateScore(ko, brutal, smart)

    map.set(userId, currentUser)
  }

  const leaderboard = Array.from(map.values()).sort((a, b) => b.score - a.score)

  return (
    <>
      <main className="center-column">
        <div className="timeline-header">
          <div className="timeline-title">Riposte</div>
        </div>

        <div className="page-panel">
          <h1 className="page-title">Single Riposte</h1>
          <p className="page-subtitle">
            返信単体の詳細ページ。
          </p>
        </div>

        {target ? (
          <RiposteCard riposte={target} />
        ) : (
          <div className="empty-box">Riposte not found.</div>
        )}
      </main>

      <RightSidebar
        topRipostes={ranked}
        topArenas={topArenas}
        leaderboard={leaderboard}
      />
    </>
  )
}