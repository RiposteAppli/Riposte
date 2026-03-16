import "./globals.css"
import type { Metadata } from "next"
import Nav from "@/components/Nav"

export const metadata: Metadata = {
  metadataBase: new URL("https://riposte.jp"),
  title: "Riposte",
  description: "最高の返信に最高の名誉を。",
  openGraph: {
    title: "Riposte",
    description: "最高の返信に最高の名誉を。",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riposte",
    description: "最高の返信に最高の名誉を。",
    images: ["/api/og"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="page-frame">
          <div className="app-shell">
            <Nav />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}