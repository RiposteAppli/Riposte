import Link from "next/link"

type TopArena = {
  id: string
  title: string | null
  riposteCount: number
}

type TopRiposte = {
  id: string
  content: string
  score: number
  ko: number
}

type LeaderboardRow = {
  userId: string
  ripostes: number
  score: number
}

type Props = {
  topRipostes: TopRiposte[]
  topArenas: TopArena[]
  leaderboard: LeaderboardRow[]
}

export default function RightSidebar({
  topRipostes,
  topArenas,
  leaderboard,
}: Props) {
  return (
    <aside className="right-column">
      <div className="right-search">
        <input className="search-input" placeholder="Search Riposte" />
      </div>

      <div className="sidebar-card">
        <div className="sidebar-header">Leaderboard</div>
        {leaderboard.slice(0, 3).map((row, index) => (
          <div key={row.userId} className="sidebar-item">
            <div className="sidebar-kicker">
              <span className="rank-num">#{index + 1}</span>
              Anonymous Player
            </div>
            <div className="sidebar-main">Anon {row.userId.slice(0, 8)}</div>
            <div className="sidebar-sub">
              Score {row.score} ・ Ripostes {row.ripostes}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-card">
        <div className="sidebar-header">Top Arenas</div>
        {topArenas.slice(0, 3).map((arena) => (
          <Link key={arena.id} href={`/arena/${arena.id}`} className="sidebar-item">
            <div className="sidebar-kicker">Arena</div>
            <div className="sidebar-main">{arena.title || "Untitled Arena"}</div>
            <div className="sidebar-sub">Ripostes {arena.riposteCount}</div>
          </Link>
        ))}
      </div>

      <div className="sidebar-card">
        <div className="sidebar-header">Best Ripostes</div>
        {topRipostes.slice(0, 3).map((riposte) => (
          <Link key={riposte.id} href={`/riposte/${riposte.id}`} className="sidebar-item">
            <div className="sidebar-kicker">Riposte</div>
            <div className="sidebar-main">{riposte.content.slice(0, 80)}</div>
            <div className="sidebar-sub">
              Score {riposte.score} ・ KO {riposte.ko}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}