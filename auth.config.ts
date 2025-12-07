import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname.startsWith('/login');
            const isOnSignUp = nextUrl.pathname.startsWith('/signup');

            if (isOnLogin || isOnSignUp) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            // Protect all other routes
            if (!isLoggedIn) {
                return false;
            }

            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
