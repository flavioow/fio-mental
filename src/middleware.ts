import {
    type MiddlewareConfig,
    type NextRequest,
    NextResponse,
} from "next/server"

const routes = [
    { path: "/login", access: "public", whenAuthenticated: "redirect" },
    { path: "/pricing", access: "public" },

    { path: "/chat", access: "private", roles: ["employee"] },
    { path: "/reports", access: "private", roles: ["employee"] },

    { path: "/dashboard", access: "private", roles: ["company"] },
    { path: "/employees", access: "private", roles: ["company"] },
] as const

const defaultRoutes = [
    { role: "", redirect: "/" },
    { role: "employee", redirect: "/chat" },
    { role: "company", redirect: "/dashboard" },
] as const

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const authToken = request.cookies.get("token")
    const authRole = request.cookies.get("role")?.value

    // verifica se a rota atual está na lista
    const matchedRoute = routes.find((route) => route.path === path)

    function redirectToDefaultRoute() {
        const redirectUrl = request.nextUrl.clone()
        const redirectRoute =
            defaultRoutes.find((i) => i.role === authRole) ?? defaultRoutes[0]

        redirectUrl.pathname = redirectRoute.redirect
        return NextResponse.redirect(redirectUrl)
    }

    // rota pública
    if (matchedRoute?.access === "public") {
        // logado, página com "redirect"
        if (
            authToken &&
            "whenAuthenticated" in matchedRoute &&
            matchedRoute.whenAuthenticated === "redirect"
        ) return redirectToDefaultRoute()

        // deixa acessar
        return NextResponse.next()
    }

    // rota privada
    if (matchedRoute?.access === "private") {
        // não logado
        if (!authToken) return redirectToDefaultRoute()

        // logado, mas com o cargo errado
        if (
            matchedRoute.roles &&
            !(matchedRoute.roles as readonly string[]).includes(authRole ?? "")
        ) return redirectToDefaultRoute()

        // deixa passar
        return NextResponse.next()
    }

    // rota não encontrada, passa
    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}
