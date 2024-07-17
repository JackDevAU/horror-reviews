import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { FilmIcon } from '../icon'
import NavSearch from './nav-search'
import NavbarUser from './navbar-user'

export default function Navbar() {
  return (
    <header className="bg-gray-900 py-4 px-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
      <Link className="flex items-center gap-2 text-2xl font-bold" href="/">
        <FilmIcon className="w-8 h-8" />
        <span>FJ Scream Zone</span>
      </Link>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <NavSearch />
        <NavbarUser />
      </div>
    </header>
  )
}
