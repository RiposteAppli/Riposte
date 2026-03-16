import type { EnrichedRiposte, ReactionRow, RiposteRow } from "@/lib/types"

export function calculateScore(ko: number, brutal: number, smart: number) {
  return ko * 5 + brutal * 3 + smart * 2
}

export function enrichRipostes(
  ripostes: RiposteRow[] | null,
  reactions: ReactionRow[] | null,
): EnrichedRiposte[] {
  const safeRipostes = ripostes ?? []
  const safeReactions = reactions ?? []

  return safeRipostes
    .map((riposte) => {
      const related = safeReactions.filter((reaction) => reaction.riposte_id === riposte.id)
      const ko = related.filter((reaction) => reaction.type === "KO").length
      const brutal = related.filter((reaction) => reaction.type === "BRUTAL").length
      const smart = related.filter((reaction) => reaction.type === "SMART").length

      return {
        ...riposte,
        ko,
        brutal,
        smart,
        score: calculateScore(ko, brutal, smart),
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}
