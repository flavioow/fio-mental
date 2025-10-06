// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// export async function POST() {
//     try {
//         const session = await getServerSession(authOptions)

//         if (!session || !session.user) {
//             return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
//         }

//         const response = NextResponse.json({
//             success: true,
//             role: session.user.role
//         })

//         // Cria cookies adicionais que o middleware pode ler
//         response.cookies.set("user-role", session.user.role, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             maxAge: 7 * 24 * 60 * 60, // 7 dias
//             path: "/",
//         })

//         response.cookies.set("user-id", session.user.id, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             maxAge: 7 * 24 * 60 * 60,
//             path: "/",
//         })

//         return response
//     } catch (error) {
//         console.error("Erro ao setar cookies:", error)
//         return NextResponse.json({ error: "Erro interno" }, { status: 500 })
//     }
// }
