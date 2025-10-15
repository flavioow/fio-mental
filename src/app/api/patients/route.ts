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

        // Busca todos os funcionários da mesma empresa
        const patients = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
                employee: {
                    companyId: companyId
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
        const formattedPatients = patients.map(user => {
            const questionario = user.employee?.questionario

            // Determina o resultado baseado no perfilPsicologico
            let resultado = "pendente"
            if (questionario?.perfilPsicologico) {
                try {
                    // Limpa possíveis backticks
                    let perfilLimpo = questionario.perfilPsicologico
                    if (typeof perfilLimpo === 'string') {
                        perfilLimpo = perfilLimpo.replace(/```json\s*|```/g, "").trim()
                    }

                    const perfil = JSON.parse(perfilLimpo)
                    resultado = perfil.tipo || "equilibrado"
                } catch (err) {
                    console.error("Erro ao parsear perfil:", err)
                    resultado = "equilibrado"
                }
            }

            return {
                id: user.id,
                nome: user.name,
                email: user.email,
                telefone: user.telefone,
                resultado,
                hasQuestionario: !!questionario,
                employeeId: user.employee?.id
            }
        })

        return NextResponse.json({
            success: true,
            patients: formattedPatients
        })
    } catch (err) {
        console.error("Erro ao buscar pacientes:", err)
        return NextResponse.json(
            { error: "Erro ao buscar pacientes" },
            { status: 500 }
        )
    }
}
