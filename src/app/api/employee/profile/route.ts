import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

        if (decoded.role !== "EMPLOYEE") {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
        }

        // Busca o funcionário com questionário e próximos agendamentos
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                employee: {
                    include: {
                        questionario: true,
                        company: {
                            select: {
                                nome: true
                            }
                        },
                        appointments: {
                            where: {
                                date: {
                                    gte: new Date()
                                },
                                status: {
                                    not: "CANCELLED"
                                }
                            },
                            include: {
                                psychologist: {
                                    include: {
                                        user: {
                                            select: {
                                                name: true,
                                                email: true
                                            }
                                        }
                                    }
                                }
                            },
                            orderBy: {
                                date: "asc"
                            },
                            take: 5
                        }
                    }
                }
            }
        })

        if (!user || !user.employee) {
            return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
        }

        // Processa o perfil psicológico
        let perfilPsicologico = null
        let resultado = null

        if (user.employee.questionario?.perfilPsicologico) {
            try {
                let perfilLimpo = user.employee.questionario.perfilPsicologico
                if (typeof perfilLimpo === 'string') {
                    perfilLimpo = perfilLimpo.replace(/```json\s*|```/g, "").trim()
                }
                perfilPsicologico = JSON.parse(perfilLimpo)
                resultado = perfilPsicologico.tipo || "equilibrado"
            } catch (err) {
                console.error("Erro ao parsear perfil:", err)
            }
        }

        return NextResponse.json({
            success: true,
            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                telefone: user.telefone,
                company: user.employee.company.nome,
                hasQuestionario: !!user.employee.questionario,
                questionarioData: user.employee.questionario?.createdAt,
                resultado,
                perfilPsicologico,
                appointments: user.employee.appointments.map(apt => ({
                    id: apt.id,
                    date: apt.date,
                    startTime: apt.startTime,
                    endTime: apt.endTime,
                    status: apt.status,
                    psychologist: {
                        name: apt.psychologist.user.name,
                        email: apt.psychologist.user.email
                    }
                }))
            }
        })
    } catch (err) {
        console.error("Erro ao buscar perfil:", err)
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
    }
}
