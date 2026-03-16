export function extractArenaTitle(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl)
    const parts = url.pathname.split("/").filter(Boolean)
    const last = parts.at(-1)

    if (url.hostname.includes("x.com") || url.hostname.includes("twitter.com")) {
      return last ? `Post ${last}` : "X Post Arena"
    }

    return url.hostname.replace(/^www\./, "")
  } catch {
    return "Arena"
  }
}

export function normalizeSourceUrl(sourceUrl: string) {
  return sourceUrl.trim()
}
