import type { Media, Movie } from 'payload-types'
import React from 'react'
import Image from 'next/image'
import { StarIcon } from './icon'
import Link from 'next/link'

export default function CarouselCardItem({ movie }: { movie: Movie }) {
  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <Image
        src={(movie.poster as Media)?.url ?? ''}
        alt={(movie.poster as Media)?.text ?? ''}
        width={(movie.poster as Media)?.width ?? 100}
        height={(movie.poster as Media)?.height ?? 100}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 to-transparent p-6 flex flex-col justify-end">
        <Link href={`/review/${movie.slug}`}>
          <h2 className="text-2xl font-bold">{movie.name}</h2>
          <div className="flex flex-row gap-2">
            <span className="flex text-lg font-extrabold content-center items-center gap-1">
              {Number(
                movie?.ratings?.reduce((acc, cur) => acc + cur.rating, 0) / movie?.ratings?.length,
              )}
              <StarIcon className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
            </span>
            <div>
              <p className="text-sm">{movie.genres?.map((genre) => genre.name).join(', ')}</p>
              <p className="text-sm">{movie.tagline}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
