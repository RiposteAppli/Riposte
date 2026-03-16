export type ArenaRow = {
  id: string
  title: string | null
  source_url: string
  created_at: string
  user_id: string | null
}

export type RiposteRow = {
  id: string
  arena_id: string
  content: string
  created_at: string
  user_id: string | null
}

export type ReactionType = "KO" | "BRUTAL" | "SMART"

export type ReactionRow = {
  id: string
  riposte_id: string
  type: ReactionType
  created_at: string
  user_id: string | null
}

export type EnrichedRiposte = RiposteRow & {
  ko: number
  brutal: number
  smart: number
  score: number
}
