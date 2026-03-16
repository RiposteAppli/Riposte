import { NextRequest, NextResponse } from "next/server"
import { extractArenaTitle } from "@/lib/url"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sourceUrl = String(body.source_url ?? "").trim()

    if (!sourceUrl) {
      return NextResponse.json({ error: "URLがない" }, { status: 400 })
    }

    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!projectUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is missing" },
        { status: 500 }
      )
    }

    if (!serviceKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is missing" },
        { status: 500 }
      )
    }

    const existingResponse = await fetch(
      `${projectUrl}/rest/v1/arenas?source_url=eq.${encodeURIComponent(sourceUrl)}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      }
    )

    const existingText = await existingResponse.text()

    if (!existingResponse.ok) {
      return NextResponse.json(
        { error: `supabase existing error: ${existingResponse.status} ${existingText}` },
        { status: 500 }
      )
    }

    const existingRows = existingText ? JSON.parse(existingText) : []

    if (existingRows.length > 0) {
      return NextResponse.json(existingRows[0])
    }

    const title = extractArenaTitle(sourceUrl)

    const createResponse = await fetch(`${projectUrl}/rest/v1/arenas`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        title,
        source_url: sourceUrl,
        user_id: body.user_id ?? null
      })
    })

    const createText = await createResponse.text()

    if (!createResponse.ok) {
      return NextResponse.json(
        { error: `supabase create error: ${createResponse.status} ${createText}` },
        { status: 500 }
      )
    }

    const createdRows = createText ? JSON.parse(createText) : []

    return NextResponse.json(createdRows[0] ?? null)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? `route create crash: ${error.message}` : "route create crash"
      },
      { status: 500 }
    )
  }
}