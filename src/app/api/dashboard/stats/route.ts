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

        // Busca estatísticas apenas desta empresa
        const totalEmployees = await prisma.user.count({
            where: {
                role: "EMPLOYEE",
                employee: {
                    companyId: companyUser.company.id
                }
            }
        })

        const employeesWithQuestionario = await prisma.employee.count({
            where: {
                companyId: companyUser.company.id,
                questionario: {
                    isNot: null
                }
            }
        })

        // Busca conclusões por mês (últimos 10 meses) - apenas desta empresa
        const tenMonthsAgo = new Date()
        tenMonthsAgo.setMonth(tenMonthsAgo.getMonth() - 10)

        const questionarios = await prisma.questionario.findMany({
            where: {
                createdAt: {
                    gte: tenMonthsAgo
                },
                employee: {
                    companyId: companyUser.company.id
                }
            },
            select: {
                createdAt: true
            }
        })

        // Agrupa por mês
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        const monthCounts: { [key: string]: number } = {}

        // Inicializa últimos 10 meses
        const now = new Date()
        for (let i = 9; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = `${monthNames[date.getMonth()]}`
            monthCounts[monthKey] = 0
        }

        // Conta questionários por mês
        questionarios.forEach(q => {
            const month = monthNames[q.createdAt.getMonth()]
            if (monthCounts[month] !== undefined) {
                monthCounts[month]++
            }
        })

        const monthlyData = Object.entries(monthCounts).map(([mes, conclusoes]) => ({
            mes,
            conclusoes
        }))

        return NextResponse.json({
            success: true,
            stats: {
                totalEmployees,
                completedEmployees: employeesWithQuestionario,
                pendingEmployees: totalEmployees - employeesWithQuestionario,
                completionRate: totalEmployees > 0
                    ? Math.round((employeesWithQuestionario / totalEmployees) * 100)
                    : 0,
                monthlyData
            }
        })
    } catch (err) {
        console.error("Erro ao buscar estatísticas:", err)
        return NextResponse.json(
            { error: "Erro ao buscar estatísticas" },
            { status: 500 }
        )
    }
}
