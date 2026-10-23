// Stock photography from Unsplash (Unsplash License: free for commercial use, no attribution required).
// Replace with SosaCraft's own project photography when available.
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'
const WIDTHS = [480, 800, 1200, 1600]

export type StockImage = {
  src: string
  srcSet: string
}

export function unsplash(photoId: string, width = 1200): StockImage {
  const url = (w: number) => `${UNSPLASH_BASE}${photoId}?auto=format&fit=crop&w=${w}&q=75`
  return {
    src: url(width),
    srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(', '),
  }
}
