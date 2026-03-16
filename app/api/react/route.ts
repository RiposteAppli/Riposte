import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const allowed = new Set(["KO", "BRUTAL", "SMART"])

export async function POST(request: NextRequest) {
  const body = await request.json()
  const riposteId = String(body.riposte_id ?? "")
  const type = String(body.type ?? "")
  const userId = String(body.user_id ?? "").trim()

  if (!riposteId || !allowed.has(type) || !userId) {
    return NextResponse.json({ error: "不正な入力" }, { status: 400 })
  }

  const existing = await supabaseAdmin
    .from("reactions")
    .select("id")
    .eq("riposte_id", riposteId)
    .eq("type", type)
    .eq("user_id", userId)
    .maybeSingle()

  if (existing.data) {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  const { error } = await supabaseAdmin.from("reactions").insert({
    riposte_id: riposteId,
    type,
    user_id: userId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
