"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "riposte_user_id"

export default function SettingsClient() {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const current = window.localStorage.getItem(STORAGE_KEY) || ""
    setUserId(current)
  }, [])

  const resetId = () => {
    const next = crypto.randomUUID()
    window.localStorage.setItem(STORAGE_KEY, next)
    setUserId(next)
  }

  return (
    <div className="form-grid">
      <div className="code-box">{userId || "まだ user_id がない"}</div>

      <div className="row">
        <button className="button button-primary" onClick={resetId}>
          匿名IDを再生成
        </button>
      </div>
    </div>
  )
}