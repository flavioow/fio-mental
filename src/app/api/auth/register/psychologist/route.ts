import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nome, cpf, telefone, crp, tempoAtuacao, descricao, email, password, companyId } = body

        // Validações básicas
        if (!nome || !cpf || !crp || !email || !password) {
            return NextResponse.json(
                { error: "Campos obrigatórios ausentes" },
                { status: 400 }
            )
        }

        // Se companyId não foi fornecido, precisa ser especificado
        if (!companyId) {
            return NextResponse.json(
                { error: "ID da empresa não fornecido" },
                { status: 400 }
            )
        }

        // Verifica se a empresa existe
        const company = await prisma.company.findUnique({
            where: { id: parseInt(companyId) }
        })

        if (!company) {
            return NextResponse.json(
                { error: "Empresa não encontrada" },
                { status: 404 }
            )
        }

        // Remove máscara do CPF
        const cpfClean = cpf.replace(/\D/g, "")
        if (cpfClean.length !== 11) {
            return NextResponse.json(
                { error: "CPF inválido" },
                { status: 400 }
            )
        }

        // Verifica se email já existe
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { error: "Email já cadastrado" },
                { status: 400 }
            )
        }

        // Verifica se CPF já existe
        const existingCPF = await prisma.psychologist.findUnique({
            where: { cpf }
        })

        if (existingCPF) {
            return NextResponse.json(
                { error: "CPF já cadastrado" },
                { status: 400 }
            )
        }

        // Verifica se CRP já existe
        const existingCRP = await prisma.psychologist.findUnique({
            where: { crp }
        })

        if (existingCRP) {
            return NextResponse.json(
                { error: "CRP já cadastrado" },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria usuário + psicólogo vinculado à empresa
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
                        tempoAtuacao: tempoAtuacao ? parseInt(tempoAtuacao) : null,
                        descricao,
                        companyId: parseInt(companyId)
                    }
                }
            },
            include: { psychologist: true }
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
            message: "Psicólogo cadastrado com sucesso",
            redirectTo: "/dash-psychologist",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60
        })

        res.cookies.set("role", user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60
        })

        return res
    } catch (err) {
        console.error("Erro ao cadastrar psicólogo:", err)
        return NextResponse.json(
            { error: "Erro inesperado ao cadastrar psicólogo" },
            { status: 500 }
        )
    }
}
