"use client"

import { useState } from "react"
import { getOrCreateUserId } from "@/lib/user"

export default function ReportForm() {
  const [targetType, setTargetType] = useState("arena")
  const [targetId, setTargetId] = useState("")
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")

  const submit = async () => {
    setMessage("")

    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId.trim(),
        reason: reason.trim(),
        user_id: getOrCreateUserId(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || "report failed")
      return
    }

    setTargetId("")
    setReason("")
    setMessage("送信した")
  }

  return (
    <div className="form-grid">
      <select
        className="select"
        value={targetType}
        onChange={(e) => setTargetType(e.target.value)}
      >
        <option value="arena">arena</option>
        <option value="riposte">riposte</option>
      </select>

      <input
        className="input"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        placeholder="target id"
      />

      <textarea
        className="textarea"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="reason"
      />

      <button className="button button-primary" onClick={submit}>
        Report
      </button>

      {message ? <div className="error-text">{message}</div> : null}
    </div>
  )
}