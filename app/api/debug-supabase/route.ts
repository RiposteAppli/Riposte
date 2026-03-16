import { NextResponse } from "next/server"

export async function GET() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!projectUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "NEXT_PUBLIC_SUPABASE_URL is missing"
      },
      { status: 500 }
    )
  }

  if (!anonKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
      },
      { status: 500 }
    )
  }

  if (!serviceKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is missing"
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${projectUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      },
      cache: "no-store"
    })

    const text = await response.text()

    return NextResponse.json({
      ok: response.ok,
      projectUrl,
      status: response.status,
      statusText: response.statusText,
      body: text
    })
  } catch (error) {
    const err = error as Error & { cause?: unknown }

    return NextResponse.json(
      {
        ok: false,
        projectUrl,
        error: err.message,
        cause: String(err.cause ?? "")
      },
      { status: 500 }
    )
  }
}