'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { posterURL } from '@/movies/utils'
import { addMovieAction } from '@/movies'
import { toast } from 'sonner'

export default function Page() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<{ id: number; poster_path: string; title: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  useEffect(() => {
    if (query) {
      setSearching(true)
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then(setMovies)
        .then(() => setSearching(false))
    } else {
      setMovies([])
    }
  }, [query])

  async function addMovie(id: number) {
    setLoading(true)
    await addMovieAction(id)
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
          {movies.map(({ id, poster_path, title }) => (
            <div
              key={id}
              className="flex flex-col items-center bg-gray-800 p-4 rounded-md shadow-md"
            >
              <Image
                src={posterURL(poster_path)}
                alt={title ?? ''}
                width={300}
                height={450}
                className="w-full aspect-[2/3] object-cover rounded-md"
              />
              <h1 className="text-center font-bold truncate text-lg my-4 text-white">{title}</h1>
              <Button disabled={loading} onClick={() => addMovie(id)} className="w-full">
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
