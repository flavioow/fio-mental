import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        // Validação básica
        if (!email || !password) {
            return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
        }

        // Busca usuário no banco
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
        }

        // Verifica senha
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
        }

        // Gera JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        // Define rota de redirecionamento baseada no role
        // let redirectTo = "/"
        // if (user.role === "EMPLOYEE") {
        //     redirectTo = "/chat"
        // } else if (user.role === "COMPANY") {
        //     redirectTo = "/dashboard"
        // } else if (user.role === "PSYCHOLOGIST") {
        //     redirectTo = "/dash-psychologist"
        // }

        // Retorna resposta
        const res = NextResponse.json({
            success: true,
            message: "Login realizado com sucesso",
            // redirectTo,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })

        // Define cookies (mesma estrutura do cadastro)
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
        })

        res.cookies.set("role", user.role, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
        })

        return res
    } catch (err) {
        console.error("Erro no login:", err)
        return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 })
    }
}
