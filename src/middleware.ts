import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('lp_admin_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/admin/login';
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Token: ${token ? 'Present' : 'Missing'}`);

    if (isAdminPage && !isLoginPage && !token) {
        console.log('[Middleware] Redirecting to /admin/login');
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isLoginPage && token) {
        console.log('[Middleware] Already logged in, redirecting to /admin');
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
