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

        // Verifica se é psicólogo
        if (decoded.role !== "PSYCHOLOGIST") {
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            )
        }

        // Busca o psicólogo e sua empresa
        const psychologistUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                psychologist: {
                    include: {
                        company: true
                    }
                }
            }
        })

        if (!psychologistUser?.psychologist) {
            return NextResponse.json(
                { error: "Psicólogo não encontrado" },
                { status: 404 }
            )
        }

        const companyId = psychologistUser.psychologist.companyId

        // Busca todos os questionários dos funcionários da empresa
        const questionarios = await prisma.questionario.findMany({
            where: {
                employee: {
                    companyId: companyId
                }
            },
            include: {
                employee: {
                    include: {
                        user: true
                    }
                }
            }
        })

        // Conta tipos de relatórios
        const reportCounts: Record<string, number> = {
            engajado: 0,
            motivado: 0,
            resiliente: 0,
            estressado: 0,
            burnout: 0,
            desmotivado: 0,
            equilibrado: 0,
            ansioso: 0,
            confiante: 0,
        }

        questionarios.forEach(q => {
            if (q.perfilPsicologico) {
                try {
                    // Limpa possíveis backticks
                    let perfilLimpo = q.perfilPsicologico
                    if (typeof perfilLimpo === 'string') {
                        perfilLimpo = perfilLimpo.replace(/```json\s*|```/g, "").trim()
                    }

                    const perfil = JSON.parse(perfilLimpo)
                    const tipo = perfil.tipo || "equilibrado"
                    if (reportCounts[tipo] !== undefined) {
                        reportCounts[tipo]++
                    } else {
                        reportCounts.equilibrado++
                    }
                } catch (err) {
                    console.error("Erro ao parsear perfil:", err)
                    reportCounts.equilibrado++
                }
            } else {
                reportCounts.equilibrado++
            }
        })

        // Formata dados para o gráfico
        const reportData = [
            { tipo: "Engajado", quantidade: reportCounts.engajado, fill: "var(--chart-1)" },
            { tipo: "Motivado", quantidade: reportCounts.motivado, fill: "var(--chart-2)" },
            { tipo: "Resiliente", quantidade: reportCounts.resiliente, fill: "var(--chart-3)" },
            { tipo: "Estressado", quantidade: reportCounts.estressado, fill: "var(--chart-4)" },
            { tipo: "Burnout", quantidade: reportCounts.burnout, fill: "var(--destructive)" },
            { tipo: "Desmotivado", quantidade: reportCounts.desmotivado, fill: "var(--secondary-foreground)" },
            { tipo: "Equilibrado", quantidade: reportCounts.equilibrado, fill: "var(--primary)" },
            { tipo: "Ansioso", quantidade: reportCounts.ansioso, fill: "var(--chart-5)" },
            { tipo: "Confiante", quantidade: reportCounts.confiante, fill: "hsl(142 76% 36%)" },
        ]

        const totalRelatorios = questionarios.length
        const pacientesAtendidos = new Set(questionarios.map(q => q.employee.userId)).size

        return NextResponse.json({
            success: true,
            stats: {
                totalRelatorios,
                pacientesAtendidos,
                reportData
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
