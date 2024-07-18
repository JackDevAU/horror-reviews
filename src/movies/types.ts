export interface MovieResult {
  id: number
  poster_path: string
  title: string
  release_date: string
  cast: { name: string; profile_path: string | null }[]
  crew: { name: string; job: string }[]
  overview: string
}
