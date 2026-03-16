"use client"

const STORAGE_KEY = "riposte_user_id"

export function getOrCreateUserId() {
  if (typeof window === "undefined") return ""

  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (existing) return existing

  const id = crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, id)
  return id
}
