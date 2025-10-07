import { NextResponse } from "next/server"

export async function POST() {
    try {
        const res = NextResponse.json({
            success: true,
            message: "Logout realizado com sucesso",
        })

        // Remove os cookies setando-os com maxAge = 0
        res.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        })

        res.cookies.set("role", "", {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        })

        return res
    } catch (err) {
        console.error("Erro no logout:", err)
        return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
    }
}
