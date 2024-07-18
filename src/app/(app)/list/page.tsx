import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import configPromise from '@payload-config'
import Image from 'next/image'
import type { Media } from 'payload-types'
import { StarIcon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import type { Metadata } from 'next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export const metadata: Metadata = {
  title: 'Our Reviews',
}

export default async function ListReviewsPage({ searchParams }: any) {
  const { page = 1 } = searchParams || {}
  const currentPage = Number.parseInt(page)

  const payload = await getPayloadHMR({ config: configPromise })

  const reviews = await payload.find({
    collection: 'movies',
    page: currentPage,
    limit: 12,
  })

  console.log(reviews)

  return (
    <div className="p-8">
      {reviews.totalDocs > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {reviews.docs.map(({ id, poster, name, ratings, slug }) => {
            const averageRating = (ratings: any) =>
              ratings
                ? Number(
                    ratings?.reduce((acc: any, cur: any) => acc + cur.rating, 0) / ratings?.length,
                  )
                : 0

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
              <Link
                href={`/review/${slug}`}
                key={id}
                className="flex flex-col items-center bg-gray-800 p-4 rounded-md shadow-md"
              >
                <Image
                  src={(poster as Media)?.url ?? ''}
                  alt={(poster as Media)?.text ?? ''}
                  width={300}
                  height={450}
                  className="w-full aspect-[2/3] object-cover rounded-md"
                />
                <h1 className="text-center font-bold truncate text-lg my-4 text-white text-wrap">
                  {name}
                </h1>
                {renderStars(averageRating(ratings) || 0)}
                <Badge>{averageRating(ratings) || 'Not Rated'}</Badge>
              </Link>
            )
          })}
          <Pagination className=" col-span-full">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={!reviews.hasPrevPage ? 'disabled' : ''}
                  aria-disabled={!reviews.hasPrevPage}
                  href={!reviews.hasPrevPage ? '#' : `?page=${currentPage - 1}`}
                />
              </PaginationItem>
              {Array.from({ length: reviews.totalPages }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink isActive={currentPage === page} href={`?page=${page}`}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className={!reviews.hasNextPage ? 'disabled' : ''}
                  aria-disabled={!reviews.hasNextPage}
                  href={!reviews.hasNextPage ? '#' : `?page=${currentPage + 1}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
