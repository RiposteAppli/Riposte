"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateArena() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    const trimmed = url.trim()

    if (!trimmed) {
      setError("URLを入れて")
      return
    }

    setLoading(true)
    setError("")

    try {
      const checkResponse = await fetch("/api/arena/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url: trimmed,
        }),
      })

      const checkText = await checkResponse.text()
      const checkData = checkText ? JSON.parse(checkText) : {}

      if (!checkResponse.ok) {
        setError(checkData.error || `check failed: ${checkResponse.status}`)
        return
      }

      if (checkData.exists && checkData.arena?.id) {
        router.push(`/arena/${checkData.arena.id}`)
        return
      }

      const createResponse = await fetch("/api/arena/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url: trimmed,
        }),
      })

      const createText = await createResponse.text()
      const createData = createText ? JSON.parse(createText) : {}

      if (!createResponse.ok) {
        setError(createData.error || `create failed: ${createResponse.status}`)
        return
      }

      if (!createData.id) {
        setError("Arena id が返ってきてない")
        return
      }

      router.push(`/arena/${createData.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="composer-box">
      <input
        className="input"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="X URLを貼ってArena化"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="row-between">
        <div className="feed-label">返信の戦場を作る</div>
        <button className="button button-primary" onClick={submit} disabled={loading}>
          {loading ? "Entering..." : "Enter Arena"}
        </button>
      </div>

      {error ? <div className="error-text">{error}</div> : null}
    </div>
  )
}