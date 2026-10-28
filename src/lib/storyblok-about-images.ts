import type { AboutViewImages } from '@/components/about/about-view'
import { assetUrl } from '@/lib/storyblok-asset'

type Blok = Record<string, unknown>

interface SharedAboutAssets {
  locationAvatars: { src: string }[]
  travelerAvatars: { src: string }[]
}

const NOTRE_HISTOIRE_SECTION = 'notre_histoire_section'

export function findNotreHistoireSection(content: unknown): Blok | undefined {
  const body = (content as { body?: unknown } | null | undefined)?.body
  if (!Array.isArray(body)) return undefined

  return body.find(
    (blok): blok is Blok =>
      typeof blok === 'object' &&
      blok !== null &&
      (blok as Blok).component === NOTRE_HISTOIRE_SECTION,
  )
}

export function getAboutViewImages(
  sharedAssets: SharedAboutAssets,
  blok: Blok | undefined,
  conceptChairFallback: string,
): AboutViewImages {
  const { locationAvatars, travelerAvatars } = sharedAssets

  return {
    shared: {
      locationAvatars: [
        locationAvatars[0]?.src ?? '/images/blog-1.jpg',
        locationAvatars[1]?.src ?? '/images/hero-home.webp',
        locationAvatars[2]?.src ?? '/images/blog-3.jpg',
      ],
      travelerAvatars: [
        travelerAvatars[0]?.src ?? '/images/avatars/voyageur-1.png',
        travelerAvatars[1]?.src ?? '/images/avatars/voyageur-2.png',
        travelerAvatars[2]?.src ?? '/images/avatars/voyageur-3.png',
      ],
    },
    about: {
      conceptLounge: assetUrl(blok?.hero_image, '/images/about/about-hero.webp'),
      conceptChair: assetUrl(blok?.concept_image, conceptChairFallback),
      conceptCorridor: assetUrl(blok?.guarantees_image, '/images/about/concept-corridor.jpg'),
      founders: {
        paul: assetUrl(blok?.founder_paul_image, '/images/about/founder-paul.jpg'),
        mayeul: assetUrl(blok?.founder_mayeul_image, '/images/about/founder-mayeul.jpg'),
        benjamin: assetUrl(blok?.founder_benjamin_image, '/images/about/founder-benjamin.jpg'),
      },
    },
  }
}
