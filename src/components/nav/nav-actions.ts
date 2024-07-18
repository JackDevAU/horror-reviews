'use server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export const searchReviewedMovies = async (search: string) => {
  const payload = await getPayloadHMR({ config: configPromise })

  const movies = await payload.find({
    collection: 'movies',
    limit: 5,
    where: {
      name: { like: search },
    },
  })

  return movies
}
