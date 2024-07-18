import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Media, Movie } from 'payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { StarIcon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { PencilIcon, Activity, DropletIcon } from 'lucide-react'

import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const payload = await getPayloadHMR({ config: configPromise })

  const movies = await payload.find({
    collection: 'movies',
    where: {
      slug: { equals: params.slug },
    },
  })

  if (movies.docs.length === 0) {
    return {
      title: 'Not Found',
    }
  }

  const movie = movies.docs[0]

  return {
    title: movie.name,
  }
}

export default async function MovieDetails({ params }: { params: { slug: string } }) {
  const { slug } = params
  const payload = await getPayloadHMR({ config: configPromise })

  const movies = await payload.find({
    collection: 'movies',
    where: {
      slug: { equals: slug },
    },
  })

  if (movies.docs.length === 0) {
    return notFound()
  }

  const movie = movies.docs[0]

  return (
    <div className="md:flex gap-2 p-4 md:p-8">
      <Image
        src={(movie.poster as Media)?.url ?? ''}
        alt={(movie.poster as Media)?.text ?? ''}
        width={(movie.poster as Media)?.width ?? 100}
        height={(movie.poster as Media)?.height ?? 100}
        className="w-1/3 rounded-3xl"
      />
      <div className="md:flex flex-col gap-2 md:w-2/3">
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-4xl border-b-2">
            {movie.name}{' '}
            {movie?.releaseDate ? `(${new Date(movie?.releaseDate).getFullYear()})` : null}
          </h1>{' '}
          <Link href={`/admin/collections/movies/${movie.id}`}>
            <PencilIcon className="w-4 h-4" />
          </Link>
        </div>
        {movie.tagline && <h2 className="font-light text-3xl mb-3">{movie.tagline}</h2>}
        <p className="font-light mb-3 text-right">
          {movie?.genres?.map(({ name }) => name).join(', ')}
        </p>
        <p className="italic">{movie.overview}</p>
        <p> Director(s): {movie.directors?.map((c) => c.name)?.join(', ')}</p>
        <p>{movie.services ? movie.services : 'No Service Recorded'}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-2 bg-blue-100 text-blue-800">
            <Activity className="w-8 h-8" />

            {movie.didWeJump ? movie.didWeJump : 'No jumps!'}
          </Badge>
          <Badge variant="destructive" className="flex items-center gap-2 bg-red-100 text-red-800">
            <DropletIcon className="w-8 h-8" />
            {movie.gory ? 'LOTS OF BLOOD' : 'Not Gory!'}
          </Badge>
        </div>

        <Carousel>
          <CarouselContent>
            {movie.cast?.map((c) => (
              <CarouselItem key={c.id} className="basis-1/6 flex flex-col">
                <Image
                  src={(c.photo as Media)?.url ?? ''}
                  alt={(c.photo as Media)?.text ?? ''}
                  width={(c.photo as Media)?.width ?? 600}
                  height={(c.photo as Media)?.height ?? 900}
                  className="w-full aspect-[6/9] object-cover"
                />
                <h1 className="text-center font-bold truncate text-xl my-5">{c.name}</h1>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10" />
          <CarouselNext className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10" />
        </Carousel>
        <div className="mt-4 space-y-4">
          {movie?.ratings?.map((rating) => (
            <MovieRatingCard key={movie.id} movie={rating || undefined} />
          ))}
        </div>
      </div>
    </div>
  )
}

// TODO: Fix this later...
const MovieRatingCard = ({ movie }: { movie?: any }) => {
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
    <div className="p-4 border border-gray-700 rounded-md bg-gray-800">
      <div className="flex items-center gap-2 mb-2">
        {renderStars(movie.rating || 0)}
        <Badge>{movie.rating}</Badge>
        <p className="text-sm text-gray-400 font-bold">{movie?.reviewer?.username}</p>
      </div>
      <div
        className="text-sm text-gray-300"
        dangerouslySetInnerHTML={{ __html: movie.review_html || '' }}
      />
    </div>
  )
}
