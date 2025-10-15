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

        // Busca o funcionário e sua empresa
        const employee = await prisma.employee.findUnique({
            where: { userId: decoded.id },
            include: { company: true }
        })

        if (!employee) {
            return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
        }

        // Busca todos os psicólogos da mesma empresa com disponibilidade
        const psychologists = await prisma.psychologist.findMany({
            where: {
                companyId: employee.companyId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        telefone: true,
                        img: true
                    }
                },
                availability: {
                    orderBy: [
                        { dayOfWeek: "asc" },
                        { startTime: "asc" }
                    ]
                }
            }
        })

        // Formata os dados
        const formattedPsychologists = psychologists.map(psych => ({
            id: psych.id,
            userId: psych.user.id,
            nome: psych.user.name,
            email: psych.user.email,
            telefone: psych.user.telefone,
            img: psych.user.img,
            crp: psych.crp,
            tempoAtuacao: psych.tempoAtuacao,
            descricao: psych.descricao,
            availability: psych.availability.map(a => ({
                id: a.id,
                dayOfWeek: a.dayOfWeek,
                startTime: a.startTime,
                endTime: a.endTime
            }))
        }))

        return NextResponse.json({
            success: true,
            psychologists: formattedPsychologists
        })
    } catch (err) {
        console.error("Erro ao buscar psicólogos:", err)
        return NextResponse.json({ error: "Erro ao buscar psicólogos" }, { status: 500 })
    }
}
