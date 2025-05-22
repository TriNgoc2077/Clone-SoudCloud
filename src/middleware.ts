import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/auth/signIn',
    error: '/error'
  }
})

export const config = { matcher: ['/playlist', '/track/upload']}