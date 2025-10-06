import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nome, cpf, telefone, crp, tempoAtuacao, descricao, email, password } = body

        // Validação básica
        if (!nome || !cpf || !telefone || !email || !password) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
        }

        // Verifica email duplicado
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria usuário + psicólogo
        const user = await prisma.user.create({
            data: {
                name: nome,
                email,
                password: hashedPassword,
                telefone,
                role: "PSYCHOLOGIST",
                psychologist: {
                    create: {
                        cpf,
                        crp,
                        tempoAtuacao: tempoAtuacao ? Number(tempoAtuacao) : null,
                        descricao,
                    },
                },
            },
            include: { psychologist: true },
        })

        // Gera JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        // Resposta + cookies
        const res = NextResponse.json({
            success: true,
            message: "Cadastro realizado com sucesso",
            redirectTo: "/dashboard", // front usa essa info
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        })

        res.cookies.set("role", user.role, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        })

        return res
    } catch (err) {
        console.error("Erro no registro de psicólogo:", err)
        return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 })
    }
}
