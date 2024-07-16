import React from 'react'
import HomeCarousel from '@/components/home-carousel'
import ReviewCardList from '@/components/horror-review-list'

const Page = () => {
  return (
    <main className="px-6 py-8">
      <HomeCarousel />
      <ReviewCardList />
    </main>
  )
}

export default Page
