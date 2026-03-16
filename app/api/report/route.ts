import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const targetType = String(body.target_type ?? "").trim()
    const targetId = String(body.target_id ?? "").trim()
    const reason = String(body.reason ?? "").trim()
    const userId = String(body.user_id ?? "").trim()

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: "不足してる" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert({
        target_type: targetType,
        target_id: targetId,
        reason,
        user_id: userId || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 }
    )
  }
}