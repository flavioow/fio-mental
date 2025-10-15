import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// GET - Buscar disponibilidade do psicólogo
export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

        if (decoded.role !== "PSYCHOLOGIST") {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
        }

        const psychologist = await prisma.psychologist.findUnique({
            where: { userId: decoded.id },
            include: {
                availability: {
                    orderBy: [
                        { dayOfWeek: "asc" },
                        { startTime: "asc" }
                    ]
                }
            }
        })

        if (!psychologist) {
            return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            availability: psychologist.availability
        })
    } catch (err) {
        console.error("Erro ao buscar disponibilidade:", err)
        return NextResponse.json({ error: "Erro ao buscar disponibilidade" }, { status: 500 })
    }
}

// POST - Salvar disponibilidade do psicólogo
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

        if (decoded.role !== "PSYCHOLOGIST") {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
        }

        const psychologist = await prisma.psychologist.findUnique({
            where: { userId: decoded.id }
        })

        if (!psychologist) {
            return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 })
        }

        const { availability } = await req.json()

        // Valida o formato
        if (!Array.isArray(availability)) {
            return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
        }

        // Remove disponibilidade antiga
        await prisma.psychologistAvailability.deleteMany({
            where: { psychologistId: psychologist.id }
        })

        // Cria nova disponibilidade
        if (availability.length > 0) {
            await prisma.psychologistAvailability.createMany({
                data: availability.map((slot: any) => ({
                    psychologistId: psychologist.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                }))
            })
        }

        return NextResponse.json({
            success: true,
            message: "Disponibilidade salva com sucesso"
        })
    } catch (err) {
        console.error("Erro ao salvar disponibilidade:", err)
        return NextResponse.json({ error: "Erro ao salvar disponibilidade" }, { status: 500 })
    }
}
