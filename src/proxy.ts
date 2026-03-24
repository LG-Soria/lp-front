import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('lp_admin_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/admin/login';
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    if (isAdminPage && !isLoginPage && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
