import type { Metadata } from 'next'
import { StoryblokStory } from '@storyblok/react/rsc'
import { AboutView } from '@/components/about/about-view'
import { Footer } from '@/components/layout/footer'
import { ApartmentsSection, getApartmentCards } from '@/components/sections/apartments-section'
import { getServerLocale } from '@/lib/i18n/server'
import { findNotreHistoireSection, getAboutViewImages } from '@/lib/storyblok-about-images'
import { getStoryblokGlobals } from '@/lib/storyblok-globals'
import { getStoryBySlug } from '@/lib/storyblok-page'
import { defineSeoMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  return defineSeoMetadata({
    ...NOTRE_HISTOIRE_METADATA[locale],
    path: '/notre-histoire',
    image: '/images/about/about-hero.webp',
  })
}

export default async function NotreHistoirePage() {
  const locale = await getServerLocale()
  const story = await getStoryBySlug('pages/notre-histoire', locale)

  if (
    locale === 'fr' &&
    story &&
    Array.isArray((story.content as { body?: unknown }).body) &&
    (story.content as { body: unknown[] }).body.length > 0
  ) {
    return (
      <>
        <StoryblokStory story={story} />
        <Footer />
      </>
    )
  }

  const [globals, apartments] = await Promise.all([
    getStoryblokGlobals(locale),
    getApartmentCards(),
  ])

  return (
    <>
      <AboutView
        siteImages={getAboutViewImages(
          globals.sharedAssets,
          // Images are shared across locales: reuse the CMS assets on the English page.
          findNotreHistoireSection(story?.content),
          '/images/alto-salon.jpg',
        )}
      />
      <ApartmentsSection apartments={apartments} />
      <Footer />
    </>
  )
}

const NOTRE_HISTOIRE_METADATA = {
  fr: {
    title: 'Notre histoire | Alto',
    description:
      'Découvrez le concept Alto, notre approche de l’hospitalité et les standards qui guident chaque adresse.',
  },
  en: {
    title: 'Our story | Alto',
    description:
      'Discover Alto’s hospitality concept, design standards, and the story behind each address.',
  },
} as const
