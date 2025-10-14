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

        // Verifica se é empresa
        if (decoded.role !== "COMPANY") {
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            )
        }

        // Busca a empresa do usuário logado
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

        // Busca apenas os funcionários desta empresa
        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
                employee: {
                    companyId: companyUser.company.id
                }
            },
            include: {
                employee: {
                    include: {
                        questionario: true
                    }
                }
            },
            orderBy: {
                name: "asc"
            }
        })

        // Formata os dados
        const formattedEmployees = employees.map(user => ({
            id: user.id,
            nome: user.name,
            email: user.email,
            telefone: user.telefone,
            cpf: user.employee?.cpf,
            concluido: !!user.employee?.questionario, // true se questionário existe
            employeeId: user.employee?.id
        }))

        return NextResponse.json({
            success: true,
            employees: formattedEmployees
        })
    } catch (err) {
        console.error("Erro ao buscar funcionários:", err)
        return NextResponse.json(
            { error: "Erro ao buscar funcionários" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request) {
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

        // Verifica se é empresa
        if (decoded.role !== "COMPANY") {
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("id")

        if (!userId) {
            return NextResponse.json(
                { error: "ID não fornecido" },
                { status: 400 }
            )
        }

        // Deleta o usuário (cascade vai deletar employee e questionario)
        await prisma.user.delete({
            where: { id: parseInt(userId) }
        })

        return NextResponse.json({
            success: true,
            message: "Funcionário removido com sucesso"
        })
    } catch (err) {
        console.error("Erro ao remover funcionário:", err)
        return NextResponse.json(
            { error: "Erro ao remover funcionário" },
            { status: 500 }
        )
    }
}
