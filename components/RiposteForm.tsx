"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getOrCreateUserId } from "@/lib/user"

type Props = {
  arenaId: string
}

export default function RiposteForm({ arenaId }: Props) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    const trimmed = content.trim()

    if (!trimmed) {
      setError("本文を入れて")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/riposte/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arena_id: arenaId,
          content: trimmed,
          user_id: getOrCreateUserId(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Riposteできなかった")
        return
      }

      setContent("")
      router.refresh()
    } catch {
      setError("通信に失敗した")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel create-panel">
      <h3 className="create-title">Riposte</h3>
      <p className="muted">切り返しを置いて、技として評価される。</p>

      <div className="top-space">
        <textarea
          className="textarea"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Your riposte."
          maxLength={280}
        />
      </div>

      <div className="top-space row">
        <button className="button button-primary" onClick={submit} disabled={loading}>
          {loading ? "Posting..." : "Riposte"}
        </button>
        <div className="pill">{content.length}/280</div>
      </div>

      {error ? <div className="error-text">{error}</div> : null}
    </div>
  )
}
