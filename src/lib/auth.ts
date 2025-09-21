import NextAuth from 'next-auth'
import Google from "next-auth/providers/google"
export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma), //must-fix prisma adapter
  providers: [Google],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 15 * 60
  },
  jwt: {
    maxAge: 60 * 60
  },
  callbacks: {
  async authorized({ auth, request }) {
    const protectedRoutes = ['/app/welcome', '/app/form-session'];
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
      return !!auth?.user;
    }
    return true;
  },
}
})