import { auth } from '@clerk/nextjs/server'

export const checkRole = async ( role) => {
  const { sessionClaims } = await auth()
  console.log(sessionClaims?.metadata.role, 'role' );

  return sessionClaims?.metadata.role === role
}