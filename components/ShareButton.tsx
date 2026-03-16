"use client"

type Props = {
  url: string
  text: string
}

export default function ShareButton({ url, text }: Props) {
  const share = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <button className="button button-secondary" onClick={share}>
      Share on X
    </button>
  )
}