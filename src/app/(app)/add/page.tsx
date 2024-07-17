import { getMeUser } from '@/lib/get-me-user'
import React from 'react'
import ClientPage from './client-page'

export default async function Page() {
  await getMeUser({
    nullUserRedirect: `/?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/add')}`,
  })

  return <ClientPage />
}
