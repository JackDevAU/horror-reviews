import { cookies } from 'next/headers'
import type { User } from 'payload-types'

export const isAuthUser = async (): Promise<{
  user: User
  token: string | undefined
}> => {
  const cookieStore = cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  return {
    user,
    token,
  }
}
