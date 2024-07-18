import React from 'react'
import { Badge } from './ui/badge'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { StarIcon } from './icon'
import type { Media, Movie } from 'payload-types'
import Image from 'next/image'

export default function ReviewCard({ movie }: { movie: Movie }) {
  const averageRating = movie?.ratings
    ? Number(movie?.ratings?.reduce((acc, cur) => acc + cur.rating, 0) / movie?.ratings?.length)
    : 0

  const formattedRating = averageRating > 0 ? averageRating.toFixed(1) : 'N/A'

  function renderStars(rating: number) {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <StarIcon key={index} className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
          ))}
        {halfStar && (
          <StarIcon className="w-4 h-4 fill-gray-100 stroke-gray-500 dark:fill-gray-800 dark:stroke-gray-400" />
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <StarIcon
              key={index + fullStars + 1}
              className="w-4 h-4 fill-gray-100 stroke-gray-500 dark:fill-gray-800 dark:stroke-gray-400"
            />
          ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <Image
        src={(movie.poster as Media)?.url ?? '/placeholder-image.webp'}
        alt={(movie.poster as Media)?.text ?? ''}
        width={(movie.poster as Media)?.width ?? 100}
        height={(movie.poster as Media)?.height ?? 100}
        className="w-full h-[200px] object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{movie.name}</h3>
          <div className="flex items-center gap-1">{renderStars(averageRating || 0)}</div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {movie.genres?.map((genre) => genre.name).join(', ')}
          </p>
          <Badge className="text-gray-50">{formattedRating}</Badge>
        </div>
        <p className="text-sm text-gray-400 mb-4">{movie?.tagline}</p>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-50"
          href={`/review/${movie.slug}`}
        >
          Read Reviews
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
