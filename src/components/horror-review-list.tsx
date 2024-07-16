import React from 'react'
import ReviewCard from './review-card'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export default async function ReviewCardList() {
  //the last 4 reviewed movies
  const payload = await getPayloadHMR({ config: configPromise })

  // Fetch all movies to calculate their ratings
  const lastReviewed = await payload.find({
    collection: 'movies',
    limit: 4,
    sort: '-movieDate',
  })

  if (!lastReviewed.docs) {
    return (
      <div>
        <p>No reviews found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {lastReviewed?.docs?.map((movie) => (
        <ReviewCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
