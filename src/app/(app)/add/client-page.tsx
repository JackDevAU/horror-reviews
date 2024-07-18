'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { posterURL } from '@/movies/utils'
import { addMovieAction } from '@/movies'
import { toast } from 'sonner'
import type { MovieResult } from '@/movies/types'
import { useDebounce } from '@payloadcms/ui/hooks/useDebounce'

export default function ClientPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<MovieResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearching(true)
      fetch(`/api/search?query=${encodeURIComponent(debouncedSearchTerm)}`)
        .then((res) => res.json())
        .then(setMovies)
        .then(() => setSearching(false))
    } else {
      setMovies([])
    }
  }, [debouncedSearchTerm])

  async function addMovie(movie: MovieResult) {
    setLoading(true)
    await addMovieAction(movie)
    toast.success('Movie added!')
    setLoading(false)
  }

  return (
    <main className="p-8">
      <p className="text-2xl mb-4">Type in the name of a movie</p>
      <div className="mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Search for a movie..."
        />
      </div>
      {searching && <div className="flex loader justify-center w-full" />}
      {movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col justify-between items-center bg-gray-800 p-4 rounded-md shadow-md"
            >
              <Image
                src={posterURL(movie.poster_path)}
                alt={movie.title ?? ''}
                width={300}
                height={450}
                className="w-full aspect-[2/3] object-cover rounded-md"
              />
              <h1 className="text-center font-bold truncate text-lg my-4 text-white text-wrap">
                {movie.title} ({movie.release_date.split('-')[0]})
              </h1>
              <div className="flex flex-col gap-2">
                <p>
                  Director:{' '}
                  {movie.crew
                    .filter((c) => c.job === 'Director')
                    .map((c) => c.name)
                    .join(', ')}
                </p>
              </div>
              <Button disabled={loading} onClick={() => addMovie(movie)} className="w-full">
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
