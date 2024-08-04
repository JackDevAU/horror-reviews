'use server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { posterURL } from './utils'
import type { MovieResult } from './types'
import type { Movie } from 'payload-types'
import { formatSlug } from '@/cms/collections/movie'

export async function searchMovies(query: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query,
      )}&include_adult=false&language=en-US&page=1&api_key=${process.env.TMDB_BEARER_TOKEN}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.results) {
      throw new Error('No results found in the API response')
    }

    const movieSearchResults = data.results
      .map(
        ({
          id,
          poster_path,
          title,
          release_date,
          overview,
        }: {
          id: string
          poster_path: string
          title: string
          release_date: string
          overview: string
          tagline: string
          genres: { name: string }[]
        }) => ({
          id,
          poster_path,
          title,
          release_date,
          overview,
        }),
      )
      .filter(({ poster_path }: { poster_path: string }) => !!poster_path)

    const combinedResults = await Promise.all(
      movieSearchResults.map(async (movie: any) => {
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US&api_key=${process.env.TMDB_BEARER_TOKEN}`,
        )

        if (!detailsResponse.ok) {
          throw new Error(`HTTP error! status: ${detailsResponse.status}`)
        }

        const { cast, crew } = await detailsResponse.json()

        const filteredCast =
          cast?.map(({ name, profile_path }: { name: string; profile_path: string }) => ({
            name,
            profile_path,
          })) || []

        const filteredCrew =
          crew
            .filter(({ job }: { job: string }) => job === 'Director' || job === 'Producer')
            ?.map(({ name, job }: { name: string; job: string }) => ({
              name,
              job,
            })) || []

        return {
          ...movie,
          cast: filteredCast,
          crew: filteredCrew,
        }
      }),
    )

    return combinedResults
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

export async function addMovieAction(_movie: MovieResult) {
  const payload = await getPayloadHMR({ config: configPromise })

  const movieDataReq = await fetch(
    `https://api.themoviedb.org/3/movie/${_movie.id}?language=en-US&api_key=${process.env.TMDB_BEARER_TOKEN}`,
  )
  const { tagline, genres: genreObjects } = await movieDataReq.json()
  const genres = genreObjects.map(({ name }: { name: string }) => ({ name }))

  const response = await fetch(posterURL(_movie.poster_path))
  const arrayBuffer = await response.arrayBuffer()
  const posterBuffer = Buffer.from(arrayBuffer)

  const posterMedia = await payload.create({
    collection: 'media',
    data: {
      text: `${_movie.title} Poster`,
    },
    file: {
      data: posterBuffer,
      name: `${_movie.id}.jpg`,
      mimetype: 'image/jpeg',
      size: posterBuffer.byteLength,
    },
  })

  const movie = await payload.create({
    collection: 'movies',
    data: {
      name: `${_movie.title}`,
      movieId: _movie.id.toString(),
      slug: `${formatSlug(_movie.title)}-${_movie.id}`,
      url: `https://www.themoviedb.org/movie/${_movie.id}?language=en-US&api_key=${process.env.TMDB_BEARER_TOKEN}`,
      ratings: [],
      poster: posterMedia.id,
      overview: _movie.overview || 'No overview provided',
      tagline: tagline,
      genres: genres,
      movieDate: new Date().toISOString(),
      releaseDate: _movie.release_date,
      directors: _movie.crew.filter(({ job }: { job: string }) => job === 'Director'),
      producers: _movie.crew.filter(({ job }: { job: string }) => job === 'Producer'),
    },
  })

  addCastToMovie(movie, _movie)

  revalidatePath('/')

  return movie
}

const addCastToMovie = async (movie: Movie, _movie: MovieResult) => {
  const payload = await getPayloadHMR({ config: configPromise })

  const castMedia = Promise.all(
    _movie.cast?.map(async ({ profile_path, name }) => {
      if (!profile_path) return null
      const castResponse = await fetch(posterURL(profile_path))
      const castArrayBuffer = await castResponse.arrayBuffer()
      const castBuffer = Buffer.from(castArrayBuffer)

      const tryFind = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: `${name}.jpg`,
          },
        },
      })

      if (tryFind.totalDocs > 0) {
        return tryFind.docs[0]
      }

      return await payload.create({
        collection: 'media',
        data: {
          text: `${name} Profile`,
        },
        file: {
          data: castBuffer,
          name: `${name}.jpg`,
          mimetype: 'image/jpeg',
          size: castBuffer.byteLength,
        },
      })
    }),
  )

  const castMediaResolved = await castMedia

  await payload.update({
    id: movie.id,
    collection: 'movies',
    data: {
      cast: _movie.cast.map(({ name }, index) => ({
        name,
        photo: castMediaResolved?.[index]?.id,
      })),
    },
  })

  revalidatePath('/')
}
