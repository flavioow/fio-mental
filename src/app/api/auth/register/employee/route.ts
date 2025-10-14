import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        // Verifica se quem está cadastrando é uma empresa
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

        // Verifica se é empresa
        if (decoded.role !== "COMPANY") {
            return NextResponse.json(
                { error: "Apenas empresas podem cadastrar funcionários" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { nome, cpf, telefone, email, password } = body

        // Validações
        if (!nome || !cpf || !email || !password) {
            return NextResponse.json(
                { error: "Campos obrigatórios ausentes" },
                { status: 400 }
            )
        }

        // Remove máscara do CPF para validação
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
        const existingCPF = await prisma.employee.findUnique({
            where: { cpf }
        })

        if (existingCPF) {
            return NextResponse.json(
                { error: "CPF já cadastrado" },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Busca o ID da empresa do usuário logado
        const companyUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { company: true }
        })

        if (!companyUser?.company) {
            return NextResponse.json(
                { error: "Empresa não encontrada" },
                { status: 404 }
            )
        }

        // Cria usuário + employee vinculado à empresa
        const user = await prisma.user.create({
            data: {
                name: nome,
                email,
                password: hashedPassword,
                telefone,
                role: "EMPLOYEE",
                employee: {
                    create: {
                        cpf,
                        companyId: companyUser.company.id
                    }
                }
            },
            include: { employee: true }
        })

        return NextResponse.json({
            success: true,
            message: "Funcionário cadastrado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        console.error("Erro ao cadastrar funcionário:", err)
        return NextResponse.json(
            { error: "Erro inesperado ao cadastrar funcionário" },
            { status: 500 }
        )
    }
}
