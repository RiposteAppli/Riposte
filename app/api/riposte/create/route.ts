import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const arenaId = String(body.arena_id ?? "")
  const content = String(body.content ?? "").trim()
  const userId = String(body.user_id ?? "").trim()

  if (!arenaId || !content) {
    return NextResponse.json({ error: "不足してる" }, { status: 400 })
  }

  if (content.length > 280) {
    return NextResponse.json({ error: "280文字まで" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("ripostes")
    .insert({
      arena_id: arenaId,
      content,
      user_id: userId || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
