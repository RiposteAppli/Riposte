"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { getOrCreateUserId } from "@/lib/user"

type Props = {
  riposteId: string
  ko: number
  brutal: number
  smart: number
}

const defs = [
  { type: "KO", label: "💀 KO", countKey: "ko" },
  { type: "BRUTAL", label: "🔥 Brutal", countKey: "brutal" },
  { type: "SMART", label: "🧠 Smart", countKey: "smart" },
] as const

export default function ReactionButtons({ riposteId, ko, brutal, smart }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const counts = {
    ko,
    brutal,
    smart,
  }

  const react = async (type: "KO" | "BRUTAL" | "SMART") => {
    setLoading(type)

    try {
      const response = await fetch("/api/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          riposte_id: riposteId,
          type,
          user_id: getOrCreateUserId(),
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="row" style={{ flexWrap: "wrap" }}>
      {defs.map((def) => (
        <button
          key={def.type}
          className="reaction-inline"
          onClick={() => react(def.type)}
          disabled={loading === def.type}
        >
          <span>{def.label}</span>
          <span>{counts[def.countKey]}</span>
        </button>
      ))}
    </div>
  )
}