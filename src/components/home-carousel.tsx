import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import CarouselCardItem from './carousel-card-item'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export default async function HomeCarousel() {
  // Get the top 3 rated movies
  const payload = await getPayloadHMR({ config: configPromise })

  // Fetch all movies to calculate their ratings
  const allMovies = await payload.find({
    collection: 'movies',
  })

  if (allMovies.docs.length === 0) {
    return null
  }

  // Calculate the average rating for each movie
  const moviesWithRatings = allMovies.docs.map((movie) => {
    if (!movie.ratings || movie.ratings.length === 0) {
      return { ...movie, averageRating: 0 }
    }
    const totalRating = movie?.ratings
      ? movie?.ratings?.reduce((acc, rating) => acc + rating.rating, 0)
      : 0

    const averageRating = movie?.ratings ? 0 : totalRating / movie?.ratings?.length
    return {
      ...movie,
      averageRating,
    }
  })

  // Sort movies by average rating in descending order and get the top 3
  const topRatedMovies = moviesWithRatings
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3)

  return (
    <Carousel className="mb-8">
      <CarouselContent>
        {topRatedMovies?.map((movie) => (
          <CarouselItem key={movie.id}>
            <CarouselCardItem movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10" />
      <CarouselNext className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10" />
    </Carousel>
  )
}
