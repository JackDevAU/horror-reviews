import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { isAuthUser } from '@/lib/is-auth-user'

export default async function NavbarUser() {
  const { user } = await isAuthUser()

  return (
    <>
      <Link href="/list">
        <Button size="sm" variant="secondary">
          All Reviews
        </Button>
      </Link>
      {user ? (
        <Link href="/add">
          <Button size="sm" variant="secondary">
            Add New Review
          </Button>
        </Link>
      ) : null}
    </>
  )
}
