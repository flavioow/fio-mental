import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
    try {
        // Verifica autenticação
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!)
        } catch {
            return NextResponse.json(
                { error: "Token inválido" },
                { status: 401 }
            )
        }

        // Busca dados do usuário
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                telefone: true,
                img: true,
                role: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            user
        })
    } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        return NextResponse.json(
            { error: "Erro ao buscar usuário" },
            { status: 500 }
        )
    }
}
