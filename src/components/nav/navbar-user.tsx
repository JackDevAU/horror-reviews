'use client'
import { useAuth } from '@payloadcms/ui/providers/Auth'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

export default function NavbarUser() {
  const { user } = useAuth()

  console.log(user)

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
