import React from 'react'
import HomeCarousel from '@/components/home-carousel'
import ReviewCardList from '@/components/horror-review-list'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export const revalidate = 0 // Static Generation

const Page = async () => {
  const payload = await getPayloadHMR({ config: configPromise })
  const allMovies = await payload.find({
    collection: 'movies',
  })

  //the last 4 reviewed movies
  const lastReviewed = await payload.find({
    collection: 'movies',
    limit: 4,
    sort: '-movieDate',
  })

  return (
    <main className="px-6 py-8">
      <HomeCarousel allMovies={allMovies} />
      <ReviewCardList lastReviewed={lastReviewed} />
    </main>
  )
}

export default Page
