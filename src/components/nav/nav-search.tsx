'use client'
import React, { type FormEvent, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { SearchIcon } from '../icon'
import { searchReviewedMovies } from './nav-actions'
import type { PaginatedDocs } from 'payload'
import type { Media, Movie } from 'payload-types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardTitle } from '../ui/card'
import Image from 'next/image'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useRouter } from 'next/navigation'

export default function NavSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<PaginatedDocs<Movie> | null>(null)
  const [loading, setLoading] = useState(false)
  const popoverRef = useRef<any>(null)
  const { push } = useRouter()

  useClickOutside(popoverRef, () => setLoading(false))

  async function searchMovies(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const results = await searchReviewedMovies(query)
    setMovies(results)
  }

  const averageRating = (movie: any) =>
    movie?.ratings
      ? Number(
          movie?.ratings?.reduce((acc: any, cur: any) => acc + cur.rating, 0) /
            movie?.ratings?.length,
        )
      : 0

  return (
    <>
      <form className="relative" onSubmit={(e) => searchMovies(e)}>
        <Input
          className="bg-gray-800 border-none focus:ring-2 focus:ring-gray-600 focus:outline-none"
          placeholder="Search movies..."
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>

      <Popover open={loading}>
        <PopoverTrigger>
          <p />
        </PopoverTrigger>
        <PopoverContent ref={popoverRef} className="-ml-48 mt-4 relative">
          <p className="text-sm text-gray-400 ">Search Results...</p>
          {movies?.docs.map((movie) => (
            <Card
              onClick={() => {
                push(`/review/${movie.slug}`)
                setLoading(false)
                setQuery('')
              }}
              key={movie.id}
              className="flex p-2 m-2 border border-gray-700 rounded-md cursor-pointer"
            >
              <Image
                src={(movie.poster as Media)?.url ?? ''}
                alt={(movie.poster as Media)?.text ?? ''}
                width={100}
                height={150}
                className="h-36 w-24 object-cover rounded-md"
              />
              <div className="flex flex-col justify-between ml-4">
                <CardTitle className="text-lg font-semibold">{movie.name}</CardTitle>
                <p className="mt-2 text-sm text-gray-500">Score: {averageRating(movie)}</p>
              </div>
            </Card>
          ))}
        </PopoverContent>
      </Popover>
    </>
  )
}
