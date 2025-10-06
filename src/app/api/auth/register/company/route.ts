import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nomeEmpresa, cnpj, telefone, endereco, setor, email, password } = body

        // Validação básica
        if (!email || !password || !nomeEmpresa || !cnpj) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
        }

        // Verifica se já existe usuário com o mesmo email
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
        }

        // Cria hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria usuário + empresa
        const user = await prisma.user.create({
            data: {
                name: nomeEmpresa,
                email,
                password: hashedPassword,
                telefone,
                role: "COMPANY",
                company: {
                    create: { nome: nomeEmpresa, cnpj, endereco, setor },
                },
            },
            include: { company: true },
        })

        // Gera JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        // Retorna resposta e cookies
        const res = NextResponse.json({
            success: true,
            message: "Cadastro realizado com sucesso",
            redirectTo: "/dashboard", // frontend pode usar essa info
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })

        // Cookies
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
        console.error("Erro no registro de empresa:", err)
        return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 })
    }
}
