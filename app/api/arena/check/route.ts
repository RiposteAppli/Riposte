import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json()
    const sourceUrl = String(body.source_url ?? "").trim()

    if (!sourceUrl) {
      return NextResponse.json({ error: "URLがない" }, { status: 400 })
    }

    const url =
      `${projectUrl}/rest/v1/arenas` +
      `?source_url=eq.${encodeURIComponent(sourceUrl)}` +
      `&select=*`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      },
      cache: "no-store"
    })

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `supabase check error: ${response.status} ${response.statusText}`,
          body: text
        },
        { status: 500 }
      )
    }

    const rows = text ? JSON.parse(text) : []

    return NextResponse.json({
      exists: rows.length > 0,
      arena: rows[0] ?? null
    })
  } catch (error) {
    const err = error as Error & { cause?: unknown }

    return NextResponse.json(
      {
        error: `route check crash: ${err.message}`,
        cause: String(err.cause ?? "")
      },
      { status: 500 }
    )
  }
}