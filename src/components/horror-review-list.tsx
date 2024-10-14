import React from 'react'
import ReviewCard from './review-card'
import type { PaginatedDocs } from 'payload'
import type { Movie } from 'payload-types'

export default async function ReviewCardList({
  lastReviewed,
}: {
  lastReviewed: PaginatedDocs<Movie>
}) {
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
