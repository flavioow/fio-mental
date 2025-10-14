import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nome, email, password, companyId } = body

        if (!nome || !email || !password || !companyId) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes (nome, email, password, companyId)" }, { status: 400 })
        }

        // Verifica se a empresa existe
        const company = await prisma.company.findUnique({
            where: { id: parseInt(companyId) }
        })

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 })
        }

        // Verifica se já existe
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria usuário + employee vinculado à empresa
        const user = await prisma.user.create({
            data: {
                name: nome,
                email,
                password: hashedPassword,
                role: "EMPLOYEE",
                employee: {
                    create: {
                        cpf: `000.000.000-${Math.floor(Math.random() * 1000)
                            .toString()
                            .padStart(3, "0")}`,
                        companyId: parseInt(companyId)
                    }
                }
            },
            include: { employee: true }
        })

        // Gera JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        // Retorna com cookie
        const res = NextResponse.json({
            success: true,
            message: "Colaborador de teste criado",
            user: { id: user.id, name: user.name, role: user.role }
        })

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60
        })

        return res
    } catch (err) {
        console.error("Erro ao criar colaborador de teste:", err)
        return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
    }
}
