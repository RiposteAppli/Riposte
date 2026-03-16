import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1020 0%, #151f37 100%)",
          color: "#f5f7fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            opacity: 0.72,
            marginBottom: 18,
          }}
        >
          The arena of replies
        </div>

        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "-0.06em",
          }}
        >
          RIPOSTE
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            opacity: 0.86,
          }}
        >
          最高の返信に最高の名誉を。
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
